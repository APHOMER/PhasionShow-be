const express = require("express"); 
const app = express();
const rateLimit = require('express-rate-limit');

const bodyParser = require('body-parser');
// const app = require("./app");
const mongoose = require('mongoose');
const dotenv = require("dotenv");

// UNHANDLED UNCAUGHT EXCEPTION
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION... Shutting down ! !! !!!', );
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE || process.env.LOCAL_DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true //false
}).then(() => console.log('DB connection successful...'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json

// API LIMITING
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from IP, please try again in an hour !'
});
app.use('/show', limiter); // To limit request rate on shows routes

app.use(bodyParser.json());


const AppError = require('./utils/appError');
const globalErrorHandler = require("./controllers/errorController"); // Error controller
const userRouter = require("./router/userRouter");
const showRouter = require("./router/showRouter");


// I can't explain the following lines of code
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);

    next();
})

// ROUTES
app.get('/', (req, res) => {
    console.log('Welcome to the PHASIONSHOW home page!')
    res.send(' WELCOME to the PHASIONSHOW home page!');
  });
  ////////////////

app.use("/user", userRouter);
app.use("/show", showRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server... !`, 404));

    // res.status(404).json({
    //     status: 'fail',
    //     message: `can't find ${req.originalUrl} on this server... !`
    // });

    // const err = new Error(`can't find ${req.originalUrl} on this server... !`);
    // err.status = "fail";
    // err.statusCode = 404;

});

// MIDDLEWARE
app.use(globalErrorHandler);



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App is running on port ${port}.....`)
});

// UNHANDLED REJECTION PROMISES
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    // console.log(err);
    console.log('UNHANDLE REJECTION... Shutting down ! !! !!!', )

    server.close(() => {
        process.exit(1);
    });
});





// module.exports = app;
