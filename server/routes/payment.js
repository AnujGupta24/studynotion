// // Import the required modules
// const express = require('express');
// const router = express.Router();

// const { capturePayment, verifySignature } = require('../controllers/payments');
// const {
// 	auth,
// 	isInstructor,
// 	isStudent,
// 	isAdmin,
// } = require('../middlewares/auth');

// router.post('/capturePayment', auth, isStudent, capturePayment);
// // router.post('/verifySignature', auth, isStudent, verifyPayment);
// router.post('/verifySignature', verifySignature);

// // router.post(
// // 	'/sendPaymentSuccessEmail',
// // 	auth,
// // 	isStudent,
// // 	sendPaymentSuccessEmail
// // );

// module.exports = router;

// Import the required modules
const express = require('express');
const router = express.Router();

const { capturePayment, verifySignature } = require('../controllers/payments');
const {
	auth,
	isInstructor,
	isStudent,
	isAdmin,
} = require('../middlewares/auth');
router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/verifySignature', verifySignature);

module.exports = router;
