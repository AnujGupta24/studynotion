const Section = require('../models/section');
const Course = require('../models/course');

// createSection
exports.createSection = async (req, res) => {
	try {
		// data fetch
		const { sectionName, courseId } = req.body;

		// validation
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: 'All fields are required',
			});
		}

		// create new section
		const newSection = await Section.create({ sectionName });

		// update course with section objectID
		const updatedCourseDetails = await Course.findByIdAndUpdate(
			courseId,
			{ $push: { courseContent: newSection._id } },
			{ new: true }
		)
			.populate({
				path: 'courseContent',
				populate: {
					path: 'subSection',
				},
			})
			.exec();

		// return res
		return res.status(200).json({
			success: true,
			message: 'Section created successfully',
			updatedCourseDetails,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Something went wrong while creating the section',
		});
	}
};

// updateSection
exports.updateSection = async (req, res) => {
	try {
		// data fetch
		const { sectionName, sectionId } = req.body;

		// validation
		if (!sectionName || !sectionId) {
			return res.status(400).json({
				success: false,
				message: 'All fields are required',
			});
		}

		// update data
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		// if section not found
		if (!section) {
			return res.status(404).json({
				success: false,
				message: 'Section not found',
			});
		}

		// return res
		return res.status(200).json({
			success: true,
			message: 'Section updated successfully',
			section,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Something went wrong while updating the section',
		});
	}
};

// deleteSection
exports.deleteSection = async (req, res) => {
	try {
		// get id - assuming we getting it using params
		const { sectionId, courseId } = req.body;

		//use findanddelete
		await Section.findByIdAndDelete(sectionId);

		// todo[testing]:- do we need to delete the entry from the courseSchema?
		await Course.findByIdAndUpdate(
			courseId,
			{ $pull: { courseContent: sectionId } },
			{ new: true }
		);

		// return res
		return res.status(200).json({
			success: true,
			message: 'Section deleted successfully',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Something went wrong while deleting the section',
		});
	}
};
