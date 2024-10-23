const Review = require('../models/reviewModel');


const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// getreview
// create review
exports.createReview = catchAsync( async (req, res, next) => {
    const newReview = await Review.create(req.body);

    console.log(newReview);

    res.status(201).json({
        status: "success",
        data: {
            Review: newReview,
        }
    });
});

exports.getAllReview = catchAsync( async (req, res, next) => {
    const reviews = await Review.find();

    console.log(reviews);

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.getReviewById = catchAsync( async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    // .populate({
    //         path: 'showOwner',
    //         select: '-__v -creatAt'
    //     });

    if(!review) {
        return next(new AppError("No REVIEW Found with that ID"))
    }

    console.log(review);

    res.status(200).json({
        status: "success",
        data: {
            review
        }
    });


})
