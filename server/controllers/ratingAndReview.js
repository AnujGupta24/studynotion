const mongoose = require('mongoose');
const Course = require('../models/course');
const RatingAndReview = require('../models/ratingAndReview');

// createRating:-
exports.createRating = async (req, res) => {
	try {
		// get user id
		const userId = req.user.id;

		// fetch from req body
		const { rating, review, courseId } = req.body;

		// check if user is enrolled  or not
		const courseDetails = await Course.findOne({
			_id: courseId,
			studentsEnrolled: { $elemMatch: { $eq: userId } },
			// studentsEnrolled: userId, -easy way
		});

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: 'Student is not enrolled in the course',
			});
		}

		// check if user already reviewd the course
		const alreadyReviewed = await RatingAndReview.findOne({
			user: userId,
			course: courseId,
		});

		if (alreadyReviewed) {
			return res.status(403).json({
				success: false,
				message: 'Course is already reviewed by the user',
			});
		}

		// create rating and review
		const ratingReview = await RatingAndReview.create({
			rating,
			review,
			course: courseId,
			user: userId,
		});

		// update course with this rating/review
		const updatedCourseDetails = await Course.findByIdAndUpdate(
			{ _id: courseId },
			{ $push: { ratingAndReviews: ratingReview._id } },
			{ new: true }
		);
		console.log('updatedCourseDetails->', updatedCourseDetails);

		// return res
		return res.status(200).json({
			success: true,
			message: 'Rating and review created successfully',
			ratingReview,
			updatedCourseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Unable to create Rating',
			error: error.message,
		});
	}
};

// getAverageRating:-
exports.getAverageRating = async (req, res) => {
	try {
		// get data
		const courseId = req.body.courseId;

		// calculate avg rating
		const result = await RatingAndReview.aggregate([
			{
				$match: {
					course: new mongoose.Types.ObjectId(courseId), // courseId string thi isliye ise convert kia object id me
				},
			},
			{
				$group: {
					_id: null, // When we don't know on what basis we want to group
					averageRating: { $avg: '$rating' },
				},
			},
		]);

		// return rating
		if (result.length > 0) {
			return res.status(200).json({
				success: true,
				averageRating: result[0].averageRating,
			});
		}

		// if no rating review exists return res
		return res.status(200).json({
			success: true,
			message: 'Average Rating is 0, No ratings given till now',
			averageRating: 0,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Unable to get average rating',
			error: error.message,
		});
	}
};

// getAllrating:- checkit out
exports.getAllRating = async (req, res) => {
	try {
		// get data
		const allReviews = await RatingAndReview.find({})
			.sort({ rating: 'desc' })
			.populate({
				path: 'user',
				select: 'firstName lastName email image', //to get particular fields, another way is like true one
			})
			.populate({
				path: 'course',
				select: 'courseName',
			})
			.exec();

		// return res
		return res.status(200).json({
			success: true,
			message: 'All rating and reviews fetched successfully',
			data: allReviews,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Unable to get all Ratings',
			error: error.message,
		});
	}
};
