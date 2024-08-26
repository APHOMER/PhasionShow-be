const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const bcrypt = require("")

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name:req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);
    // jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN
    // });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


exports.login = catchAsync( async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email && password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exits && password is correct
    const user = await User.findOne({ email }).select("+password");
    // const correctPass = await user.correctPassword(password, user.password);

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    console.log(user);

    // 3) If everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token
    });
});

exports.protect = catchAsync( async (req, res, next) => {
    // 1) Check if the token exist
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    
    if(!token) {
        return next(new AppError('You are not logged in ! Please log in to get access.', 401));
    }
    // 2) Token Verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    };

    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     console.log(decoded.iat, currentUser);
    //     return next(
    //         new AppError('User recently changed password ! Please log in again', 401)
    //     );
    // };

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['ticketer', 'event-planner', 'admin', 'ceo']. role="user"
        if(!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};

