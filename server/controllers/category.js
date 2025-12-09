const Category = require('../models/category');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// createCategory
exports.createCategory = async (req, res) => {
	try {
		// fetch
		const { name, description } = req.body;
		// Validate
		if (!name) {
			return res.status(400).json({
				success: false,
				message: 'Fill fileds properly',
			});
		}
		// Creating entry on DB
		const categoryDetails = await Category.create({
			name,
			description,
		});
		console.log(categoryDetails);

		res.status(201).json({
			success: true,
			message: 'Category created successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Category creation failed failed',
		});
	}
};

//  all Category
exports.showAllCategories = async (req, res) => {
	try {
		const allCategories = await Category.find({}, { name: true, description: true });
		res.status(200).json({
			success: true,
			message: 'All category returned successfully',
			data: allCategories,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Something went wrong while getting all the category',
		});
	}
};

// Category page details
exports.categoryPageDetails = async (req, res) => {
	try {
		// Fetch
		const { categoryId } = req.body;
		console.log('printing category Id', categoryId);

		// get courses for specific category id
		const selectedCategory = await Category.findById(categoryId)
			.populate({
				path: 'courses',
				match: { status: 'Published' },
				populate: 'ratingAndReviews',
			})
			.exec();
		console.log('selected course-----', selectedCategory);

		//Validation
		if (!selectedCategory) {
			console.log('category not found');
			return res.status(404).json({
				success: false,
				message: 'Category not found',
			});
		}

		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log('No courses found for the selected category.', selectedCategory.name);
			return res.status(404).json({
				success: false,
				message: 'No courses found for the selected category.',
			});
		}

		// Get courses for different categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		});
		console.log('categoriesExceptSelected........', categoriesExceptSelected);

		let differentCategory = await Category.findOne(
			categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
		)
			.populate({
				path: 'courses',
				match: { status: 'Published' },
			})
			.exec();
		// console.log('Different COURSE', differentCategory);
		console.log('differentCategory RESPONSE', differentCategory);

		// Get top-selling courses across all categories
		const allCategories = await Category.find()
			.populate({
				path: 'courses',
				match: { status: 'Published' },
				populate: { path: 'instructor' },
			})
			.exec();

		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);
		console.log('mostSellingCourses COURSE----', mostSellingCourses);

		return res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategory,
				mostSellingCourses,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Error while getting category page details',
			error: error.message,
		});
	}
};
