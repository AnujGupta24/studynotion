const express = require('express');
const app = express();

// routes:-
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payment');
const courseRoutes = require('./routes/course');
const contactUsRoute = require('./routes/contact');

// db:-
const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudinaryConnect } = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 5000;

// db connect:-
database();

// middleware:-
app.use(express.json()); // body parser
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true, // This allows cookie jwt other senstive info flow with requests
	})
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp',
	})
);

// cloudinary Connect:-
cloudinaryConnect();

// routes -- API mount:-
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/reach', contactUsRoute);

// def route:-
app.get('/', (req, res) => {
	return res.json({
		success: true,
		message: 'DEFAULT ROUTE',
	});
});

// server activate:-
app.listen(PORT, () => {
	console.log('Server is running on:', PORT);
});
