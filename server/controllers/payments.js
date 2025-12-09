const { instance } = require('../config/razorpay');
const Course = require('../models/course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail');
const mongoose = require('mongoose');
const CourseProgress = require('../models/courseProgress');

// ************************* This code is for the multiple purchase items using actual documentation **************************

// initiate the razorpay order
exports.capturePayment = async (req, res) => {
	console.log('Capturing of payment is started ');
	const { courses } = req.body;
	const userId = req.user.id;

	// if no course found
	if (courses.length === 0) {
		return res.json({ success: false, message: 'Please provide Course Id' });
	}
	console.log('line no 21');

	// if course found calculate the total amount
	let totalAmount = 0;

	for (const course_id of courses) {
		let course;

		try {
			course = await Course.findById(course_id);
			if (!course) {
				return res.status(200).json({ success: false, message: 'Could not find the course' });
			}
			console.log('line no 32');

			// check if student is already enrolled
			const uid = new mongoose.Types.ObjectId(userId);
			if (course.studentsEnrolled.includes(uid)) {
				return res.status(200).json({ success: false, message: 'Student is already Enrolled' });
			}

			totalAmount += course.price;
			console.log('line no 40');
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	const currency = 'INR';
	// create options
	const options = {
		amount: totalAmount * 100,
		currency,
		receipt: Math.random(Date.now()).toString(),
	};

	console.log('line no 54');

	// create order
	try {
		const paymentResponse = await instance.orders.create(options);
		res.json({
			success: true,
			message: paymentResponse,
		});
	} catch (error) {
		console.log('line no 63');
		console.log(error);
		return res.status(500).json({
			success: false,
			mesage: 'Could not Initiate Order',
		});
	}
};

// verify the payment
exports.verifyPayment = async (req, res) => {
	const razorpay_order_id = req.body?.razorpay_order_id;
	const razorpay_payment_id = req.body?.razorpay_payment_id;
	const razorpay_signature = req.body?.razorpay_signature;
	const courses = req.body?.courses;
	const userId = req.user.id;

	// validation
	if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
		return res.status(200).json({
			success: false,
			message: 'Payment Failed',
		});
	}

	let body = razorpay_order_id + '|' + razorpay_payment_id;
	const expectedSignature = crypto
		.createHmac('sha256', process.env.RAZORPAY_SECRET)
		.update(body.toString())
		.digest('hex');

	// if signature matched
	if (expectedSignature === razorpay_signature) {
		//enroll karwao student ko
		await enrollStudents(courses, userId, res);
		//return res
		return res.status(200).json({
			success: true,
			message: 'Payment Verified',
		});
	}
	return res.status(200).json({
		success: 'false',
		message: 'Payment Failed',
	});
};

const enrollStudents = async (courses, userId, res) => {
	if (!courses || !userId) {
		return res.status(400).json({
			success: false,
			message: 'Please Provide data for Courses or UserId',
		});
	}

	// if multiple course insert student id in all of them
	for (const courseId of courses) {
		try {
			//find the course and enroll the student in it
			const enrolledCourse = await Course.findOneAndUpdate(
				{ _id: courseId },
				{ $push: { studentsEnrolled: userId } },
				// get the updated document
				{ new: true }
			);

			if (!enrolledCourse) {
				return res.status(500).json({
					success: false,
					message: 'Course not Found',
				});
			}

			// Creating course progress entry in the db
			const courseProgress = await CourseProgress.create({
				courseId: courseId,
				userId: userId,
				completedVideos: [],
			});

			//find the student and add the course to their list of enrolledCOurses
			const enrolledStudent = await User.findByIdAndUpdate(
				userId,
				{
					$push: {
						courses: courseId,
						courseProgress: courseProgress._id,
					},
				},
				{ new: true }
			);

			///bachhe ko mail send karo
			const emailResponse = await mailSender(
				enrollStudents.email,
				`Successfully Enrolled into ${enrolledCourse.courseName}`,
				courseEnrollmentEmail(
					enrolledCourse.courseName,
					`${enrolledStudent.firstName} ${enrolledStudent.lastName}`
				)
			);

			console.log('Email Sent Successfully', emailResponse.response);
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}
};

exports.sendPaymentSuccessEmail = async (req, res) => {
	const { orderId, paymentId, amount } = req.body;
	const userId = req.user.id;

	if (!orderId || !paymentId || !amount || !userId) {
		return res.status(400).json({
			success: false,
			message: 'Please provide all the fields',
		});
	}

	try {
		// student dhundho
		const enrolledStudent = await User.findById(userId);
		await mailSender(
			enrolledStudent.email,
			`Payment Recieved`,
			paymentSuccessEmail(`${enrolledStudent.firstName}`, amount / 100, orderId, paymentId)
		);
	} catch (error) {
		console.log('error in sending mail', error);
		return res.status(500).json({
			success: false,
			message: 'Could not send email',
		});
	}
};

// *************************The below code is for the single purchase item using webhook **************************

// capture the payment and initiate the razorpay order:
// exports.capturePayment = async (req, res) => {
// 	// get courseid and userid
// 	const { course_id } = req.body;
// 	const userId = req.user.id;

// 	// validation
// 	//  valid courseid
// 	if (!course_id) {
// 		return res.status(400).json({
// 			success: false,
// 			message: 'Please provide valid course ID',
// 		});
// 	}

// 	// valid coursedetail
// 	let course;
// 	try {
// 		course = await Course.findById(course_id);
// 		if (!course) {
// 			return res.send(400).json({
// 				success: false,
// 				message: 'Could not find the course',
// 			});
// 		}

// 		// validate user already pay for the same course
// 		const uid = new mongoose.Types.ObjectId(userId);
// 		console.log('payments.js uid ->', uid);
// 		if (course.studentsEnrolled.includes(uid)) {
// 			return res.status(400).json({
// 				success: false,
// 				message: 'Student is already enrolled',
// 			});
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json({
// 			success: false,
// 			message: 'invalid course details',
// 			error: error.message,
// 		});
// 	}

// 	// order create
// 	const amount = course.price;
// 	const currency = 'INR';

// 	const options = {
// 		amount: amount * 100,
// 		currency,
// 		receipt: Math.random(Date.now()).toString(),
// 		notes: {
// 			courseId: course_id,
// 			userId,
// 		},
// 	};

// 	try {
// 		// initate the payment using razorpay
// 		const paymentResponse = await instance.orders.create(options);
// 		console.log('paymentResponse->', paymentResponse);

// 		// return res
// 		return res.status(200).json({
// 			success: true,
// 			courseName: course.courseName,
// 			courseDescription: course.courseDescription,
// 			thumbnail: course.thumbnail,
// 			orderId: paymentResponse.id,
// 			currency: paymentResponse.currency,
// 			amount: paymentResponse.amount,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.send(500).json({
// 			success: false,
// 			message: 'Could not initiate order',
// 		});
// 	}
// };

// // verify signature of razorpay and server
// exports.verifySignature = async (req, res) => {
// 	const webhookSecret = '12345678'; //my secret

// 	const signature = req.headers('x-razorpay-signature'); //razorpay secret

// 	// hashing algo
// 	const shasum = crypto.createHmac('sha256', webhookSecret);
// 	shasum.update(JSON.stringify(req.body));
// 	const digest = shasum.digest('hex');

// 	if (signature === digest) {
// 		console.log('Payment is authorised');

// 		// after payment is authorised we have to put the details into course and user
// 		const { courseId, userId } = req.body.payload.payment.entity.notes;

// 		try {
// 			// fullfil the actions
// 			// find the course and enroll the student in it
// 			const enrolledCourse = await Course.findOneAndUpdate(
// 				{ _id: courseId },
// 				{ $push: { studentsEnrolled: userId } },
// 				{ new: true }
// 			);

// 			if (!enrolledCourse) {
// 				return res.status(500).json({
// 					success: false,
// 					message: 'Course not found',
// 				});
// 			}
// 			console.log('enrolledCourse->', enrolledCourse);

// 			// find the student and add the course to their list ie.enrolled courses me
// 			const enrolledStudent = await User.findOneAndUpdate(
// 				{ _id: userId },
// 				{ $push: { courses: courseId } },
// 				{ new: true }
// 			);
// 			console.log('enrolledStudent->', enrolledStudent);

// 			// send confirmation mail
// 			const emailResponse = await mailSender(
// 				enrolledStudent.email,
// 				'Congratulations from studynotion',
// 				'Congratulations, you have enrolled in to the course'
// 			);
// 			console.log('emailResponse->', emailResponse);

// 			return res.status(200).json({
// 				success: true,
// 				message: 'Signature verified and course added',
// 			});
// 		} catch (error) {
// 			console.log(error);
// 			return res.status(500).json({
// 				success: false,
// 				message: error.message,
// 			});
// 		}
// 	} else {
// 		return res.status(400).json({
// 			success: false,
// 			message: 'invalid request',
// 		});
// 	}
// };
