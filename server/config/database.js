const mongoose = require('mongoose');
require('dotenv').config();

const connectWithDb = () => {
	mongoose
		.connect(process.env.MONGODB_URL)
		.then(() => console.log('MongoDB connected successfully!'))
		.catch((err) => {
			console.error(err.message);
			console.log('Error while connecting to the mongo DB');
			process.exit(1);
		});
};

module.exports = connectWithDb;
