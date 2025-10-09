const { instance } = require('../config/razorpay');
const Course = require('../models/course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {
	courseEnrollmentEmail,
} = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');

// capture the payment and initiate the razorpay order:
exports.capturePayment = async (req, res) => {
	// get courseid and userid
	const { course_id } = req.body;
	const userId = req.user.id;

	// validation
	//  valid courseid
	if (!course_id) {
		return res.status(400).json({
			success: false,
			message: 'Please provide valid course ID',
		});
	}

	// valid coursedetail
	let course;
	try {
		course = await Course.findById(course_id);
		if (!course) {
			return res.send(400).json({
				success: false,
				message: 'Could not find the course',
			});
		}

		// validate user already pay for the same course
		const uid = new mongoose.Types.ObjectId(userId);
		console.log('payments.js uid ->', uid);
		if (course.studentsEnrolled.includes(uid)) {
			return res.status(400).json({
				success: false,
				message: 'Student is already enrolled',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'invalid course details' || error.message,
		});
	}

	// order create
	const amount = course.price;
	const currency = 'INR';

	const options = {
		amount: amount * 100,
		currency,
		receipt: Math.random(Date.now()).toString(),
		notes: {
			courseId: course_id,
			userId,
		},
	};

	try {
		// initate the payment using razorpay
		const paymentResponse = await instance.orders.create(options);
		console.log('paymentResponse->', paymentResponse);

		// return res
		return res.status(200).json({
			success: true,
			courseName: course.courseName,
			courseDescription: course.courseDescription,
			thumbnail: course.thumbnail,
			orderId: paymentResponse.id,
			currency: paymentResponse.currency,
			amount: paymentResponse.amount,
		});
	} catch (error) {
		console.log(error);
		return res.send(500).json({
			success: false,
			message: 'Could not initiate order',
		});
	}
};

// verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
	const webhookSecret = '12345678'; //my secret

	const signature = req.headers('x-razorpay-signature'); //razorpay secret

	// hashing algo
	const shasum = crypto.createHmac('sha256', webhookSecret);
	shasum.update(JSON.stringify(req.body));
	const digest = shasum.digest('hex');

	if (signature === digest) {
		console.log('Payment is authorised');

		// after payment is authorised we have to put the details into course and user
		const { courseId, userId } = req.body.payload.payment.entity.notes;

		try {
			// fullfil the actions
			// find the course and enroll the student in it
			const enrolledCourse = await Course.findOneAndUpdate(
				{ _id: courseId },
				{ $push: { studentsEnrolled: userId } },
				{ new: true }
			);

			if (!enrolledCourse) {
				return res.status(500).json({
					success: false,
					message: 'Course not found',
				});
			}
			console.log('enrolledCourse->', enrolledCourse);

			// find the student and add the course to their list ie.enrolled courses me
			const enrolledStudent = await User.findOneAndUpdate(
				{ _id: userId },
				{ $push: { courses: courseId } },
				{ new: true }
			);
			console.log('enrolledStudent->', enrolledStudent);

			// send confirmation mail
			const emailResponse = await mailSender(
				enrolledStudent.email,
				'Congratulations from studynotion',
				'Congratulations, you have enrolled in to the course'
			);
			console.log('emailResponse->', emailResponse);

			return res.status(200).json({
				success: true,
				message: 'Signature verified and course added',
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	} else {
		return res.status(400).json({
			success: false,
			message: 'invalid request',
		});
	}
};
