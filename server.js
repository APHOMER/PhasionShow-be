const express = require("express"); 
const app = express();
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require('hpp');
const cors = require('cors');


const bodyParser = require('body-parser');
// const app = require("./app");
const mongoose = require('mongoose');
const dotenv = require("dotenv");


// Set security HTTP Headers
app.use(helmet());
app.use(cors());

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
}).then(
    // async
    () => {
    // let retro = await fetch("https://phasionshow-be.onrender.com/user/login", {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         email: "aphomer@gmail.com",
    //         password: "aphomers"
    //     })
    // });
    // const content = await retro.json();
    // console.log({HEREEEE: content})
    console.log('DB connection successful...')
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(express.json()) // From GNC 10/7/2027:::1:25am

// DEVELOPMENT LOGGING
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// LIMIT REQUEST FROM SAME API 
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many request from IP, please try again in an hour !'
// });
// app.use('/show', limiter); // To limit request rate on shows routes

// BODY PARSER, READING DATA FROM BODY INTO req.body
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10kb' }));

// DATA SANITIZATION AGAINST NoSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS - html
app.use(xss());

// PREVENT PARAMETER POLUTION
// app.use(hpp({
//     whitelist: [
//         'showName',
//         'showLocation',
//         'address',
//         'price',
//         'ticketType',
//     ]
// }));

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));


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
