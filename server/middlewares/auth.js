const jwt = require('jsonwebtoken');
require('dotenv').config();

// auth:-
exports.auth = async (req, res, next) => {
	try {
		//extract token
		const token =
			req?.cookies?.token || req?.body?.token || req?.header('Authorization')?.replace('Bearer ', ''); // safe way

		//if token missing, then return response
		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Token is missing',
			});
		}
		//verify the token
		try {
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			console.log('LOGGED IN USER--------', decode);
			req.user = decode;
		} catch (err) {
			//verification - issue
			return res.status(401).json({
				success: false,
				message: 'Token is invalid' + err.message,
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Token could not be validated' + error.message,
		});
	}
};

// isStudent:-
exports.isStudent = async (req, res, next) => {
	try {
		// comming form the decode token
		if (req.user.accountType !== 'Student') {
			return res.status(401).json({
				success: false,
				message: 'This is a protected route for Students only',
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'User role cannot be verified, please try again',
			error: error.message,
		});
	}
};

// isInstructor:-
exports.isInstructor = async (req, res, next) => {
	try {
		if (req.user.accountType !== 'Instructor') {
			return res.status(401).json({
				success: false,
				message: 'This is a protected route for Instructor only',
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'User role cannot be verified, please try again',
			error: error.message,
		});
	}
};

// isAdmin:-
exports.isAdmin = async (req, res, next) => {
	try {
		if (req.user.accountType !== 'Admin') {
			return res.status(401).json({
				success: false,
				message: 'This is a protected route for Admin only',
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'User role cannot be verified, please try again',
			error: error.message,
		});
	}
};
