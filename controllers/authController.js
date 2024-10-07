const crypto = require("crypto");
const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
// const bcrypt = require("")

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100
        ),
        // secure: true,
        httpOnly: true
    };
    
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: user.toJSON() // From GNC 10/7/2027:::1:25am
        }
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

    createSendToken(newUser, 201, res);

    // const token = signToken(newUser._id); // Replaced with createSendToken
    // // jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    // //     expiresIn: process.env.JWT_EXPIRES_IN
    // // });

    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // });
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
    createSendToken(user, 200, res);

    // const token = signToken(user._id); // Replaced with createSendToken
    // res.status(200).json({
    //     status: "success",
    //     token
    // });
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
    console.log(decoded);

     // 3A) Check if the decoded id is a valid ObjectId
     if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return next(new AppError('Invalid token! Please log in again.', 401));
    }

    // 3B) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);
    if(!currentUser) {
        console.log('NO CURRENT---USER')
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    };

    // // 4) Check if user changed password after the token was issued
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get the user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new AppError("User with this email address does not exist.", 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    // await user.save(); // This brings validation errors
    await user.save({ validateBeforeSave: false });

    // 3) Send it to the user's email
    const resetURL = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`;
    console.log(resetURL)

    const message = `Your password reset token (is valid for just 10mins).\n Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: message //"Your password reset token (is valid for just 10mins)",
            // text: message
        });
    } catch (error) {
        console.log(error);

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email, Try again later'),
            500
        );
    }
    
});

// VIDEO 136 & 137
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changePasswordAT property for the user
    // 4) Log the user in, send JWTconst token = signToken(user._id);
    createSendToken(user, 200, res);
});

// VIDEO 136 & 137
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Check if POSTed current password is correct
    if(!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update the password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save(); // user.findByIdAndUpdate will NOT work as intended

    // 4) log user in, send JWT
    createSendToken(user, 200, res);

});



