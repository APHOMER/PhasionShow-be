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
}).then(() => console.log('DB connection successful.....'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

const userRouter = require("./router/userRouter");

app.use("/user", userRouter);




const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on port ${port}.....`)
});


// module.exports = app;
