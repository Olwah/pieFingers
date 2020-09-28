const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Access the MongoDB database path and replace the password variable in the string
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// The settings added here are just to deal with deprecation warnings
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

/*
const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Listening to requests on port ${port}`);
});
*/

// Handles any unhandled promises to make them more readable and prevent the app from quitting.
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    // Close the server down first after it completes its tasks then exit the app.
    server.close(() => {
        process.exit(1); // '0' for success, '1' for fail.
    });
});
