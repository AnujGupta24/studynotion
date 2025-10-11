const User = require('../models/User');
const OTP = require('../models/otp');
const otpGenerator = require('otp-generator');
const Profile = require('../models/profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
require('dotenv').config();

// sendotp:-
exports.sendOtp = async (req, res) => {
	try {
		// Fetch email id from requrest
		const { email } = req.body;

		// check if user already exists
		const checkUserExists = await User.findOne({ email });

		if (checkUserExists) {
			return res.status(400).json({
				success: false,
				message: 'User is Already Registered',
			});
		}

		// generate OTP
		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		console.log('OTP generated --> ', otp);

		// Checking is otp is unique
		let result = await OTP.findOne({ otp: otp });
		console.log('send otp Result', result);

		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});

			result = await OTP.findOne({ otp: otp });
		}

		const otpPayload = { email, otp };

		// Making entry of otp in db
		const otpBody = await OTP.create(otpPayload);
		console.log('otpbody', otpBody);

		res.status(200).json({
			success: true,
			message: 'Otp Sent successfully',
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// signup:-
exports.signUp = async (req, res) => {
	try {
		// fetch data from body
		const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } =
			req.body;

		// validation
		if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
			return res.status(403).json({
				success: false,
				message: 'All fields are required',
			});
		}

		// match the 2 pwd
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: 'Password does not match',
			});
		}

		// check user already exist or not
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists. Please sign in to continue.',
			});
		}

		// find most recent otp stored for the user
		const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log('recentOtp:', recentOtp);

		// validate otp
		if (recentOtp.length == 0) {
			return res.status(400).json({
				success: false,
				message: 'OTP not found',
			});
		} else if (otp !== recentOtp[0].otp) {
			//Invalid otp
			return res.status(400).json({
				success: false,
				message: 'Invalid OTP',
			});
		}

		// hash the pwd
		const hashedPassword = await bcrypt.hash(password, 10);

		// Set approved based on accountType
		// let approved = accountType === 'Instructor' ? false : true;

		// create entry in db
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});

		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
		});

		// return res
		return res.status(200).json({
			success: true,
			message: 'User registered successfully',
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'User cannot be registered, please try again',
		});
	}
};

// login:-
exports.login = async (req, res) => {
	try {
		// fetch data
		const { email, password } = req.body;
		// validation
		if (!email || !password) {
			return res.status(403).json({
				success: false,
				message: 'All fields are required',
			});
		}

		// check user exist or not
		const user = await User.findOne({ email }).populate('additionalDetails');

		if (!user) {
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// generate JWT, after matching password
		if (await bcrypt.compare(password, user.password)) {
			const payload = {
				email: user.email,
				id: user._id,
				accountType: user.accountType,
			};
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: '24h',
			});
			user.token = token;
			user.password = undefined;

			// create cookie and send res
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			return res.cookie('token', token, options).status(200).json({
				success: true,
				token,
				user,
				message: 'User login success',
			});
		} else {
			return res.status(401).json({
				success: false,
				message: 'Password is incorrect',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'Login Failure, please try again',
		});
	}
};

// changepwd:-
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ success: false, message: 'The password is incorrect' });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: 'The password and confirm password does not match',
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log('Email sent successfully:', emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error('Error occurred while sending email:', error);
			return res.status(500).json({
				success: false,
				message: 'Error occurred while sending email',
				error: error.message,
			});
		}

		// Return success response
		return res.status(200).json({ success: true, message: 'Password updated successfully' });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error('Error occurred while updating password:', error);
		return res.status(500).json({
			success: false,
			message: 'Error occurred while updating password',
			error: error.message,
		});
	}
};
