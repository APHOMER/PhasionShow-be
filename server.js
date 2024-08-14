const express = require("express"); 
const app = express();

const bodyParser = require('body-parser');


// const app = require("./app");

const mongoose = require('mongoose');
const dotenv = require("dotenv");
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
app.use(bodyParser.json());


const AppError = require('./utils/appError');
const globalErrorHandler = require("./controllers/errorController"); // Error controller
const userRouter = require("./router/userRouter");
// const showRouter = require("./router/showRouter");

// ROUTES
app.use("/user", userRouter);
// app.use("show", showRouter);

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

app.listen(port, () => {
    console.log(`App is running on port ${port}.....`)
});


// module.exports = app;
