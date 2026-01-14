const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

// resetpwdtoken-> mail send wala kaam
exports.resetPasswordToken = async (req, res) => {
	try {
		// get email from req body
		const email = req.body.email;
		// check user for this email, email validation
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This email ${email} is not registered with us, enter valid email`,
			});
		}

		// generate token
		const token = crypto.randomUUID();

		// update user by adding token and expiration time
		const updatedDetails = await User.findOneAndUpdate(
			{ email },
			{ $set: { token, resetPasswordExpires: Date.now() + 3600000 } },
			{ new: true }
		);

		console.log('DETAILS', updatedDetails);

		// create url
		const url = `http://localhost:5173/update-password/${token}`; // frontend link to change the password

		// send mail containing the url
		await mailSender(email, 'Your password reset link is -', `Click here to rest your password: ${url}`);

		// return res
		return res.status(200).json({
			success: true,
			message: 'Reset link have been send to your email',
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Something went wrong while sending reset password mail',
			error: error.message,
		});
	}
};

// resetpwd
exports.resetPassword = async (req, res) => {
	try {
		// data fetch - token has been sent via FE
		const { password, confirmPassword, token } = req.body;

		// validation
		if (password !== confirmPassword) {
			return res.json({
				success: false,
				message: 'Password do not match',
			});
		}

		// get user details from db using token
		const userDetails = await User.findOne({ token: token });

		// if no entry - invalid token
		if (!userDetails) {
			return res.send(400).json({
				success: false,
				message: 'Token is invalid',
			});
		}

		// token is expire or not
		if (userDetails.resetPasswordExpires < Date.now()) {
			return res.json({
				success: false,
				message: 'Token is expired, please regenerate your token',
			});
		}

		// hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// update the password
		await User.findOneAndUpdate(
			{ token: token }, // Find doc on the basis of this
			{ password: hashedPassword }, // and update
			{ new: true } // return updated doc
		);

		// return response
		return res.status(200).json({
			success: true,
			message: 'Password reset successfully',
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to reset password',
			error: error.message,
		});
	}
};
