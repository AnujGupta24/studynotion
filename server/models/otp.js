const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const mailTemplate = require('../mail/templates/emailVerificationTemplate');

const otpSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		expires: 5 * 60, // 5 minutes
	},
});

// pre save middleware -> to send emails
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			'Your OTP for verification on Study Notion',
			mailTemplate(email, otp)
		);
		console.log('Email sent Successfully-> ', mailResponse);
	} catch (error) {
		console.log('error occured while sending email-> ', error);
		throw error;
	}
}

otpSchema.pre('save', async function (next) {
	await sendVerificationEmail(this.email, this.otp);
	next();
});

module.exports = mongoose.model('OTP', otpSchema);
