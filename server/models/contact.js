const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: Number,
		required: true,
	},
	message: {
		type: String,
	},
});

module.exports = mongoose.model('Contact', contactSchema);
