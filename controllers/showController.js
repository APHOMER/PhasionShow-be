const User = require("../models/userModel.js"); // Thank God;
const Show = require("../models/showModel.js");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createShow = catchAsync(async (req, res, next) => {
    const newShow = await Show.create(req.body);

        console.log(newShow);

        res.status(201).json({
            status: "success",
            data: {
                Show: newShow
            }
        });

});


exports.getAllShow = catchAsync(async (req, res, next) => {
        
        const show = await Show.find();
        
        console.log(show);
        res.status(200).json({
            status: "success",
            data: {
                show
            }

        })

    
});


exports.getShow = catchAsync(async(req, res, next) => {
    // try {

        const show = await Show.findById(req.params.id).populate('reviews');
        // .populate({
        //     path: 'showOwner',
        //     select: '-__v -creatAt'
        // });

        if(!show) {
            return next(new AppError("No show found in that ID", 404));
        }

        console.log("current Show",show);
        let showOwner = show.showOwner;
        showOwner.forEach((owner) => {
            console.log(owner.name);
        });
        // console.log("Show Owner",showOwner.forEach((owner) => owner.name));
        res.status(200).json({
            status: "success",
            data: {
                show
            }
        });

    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     })
    // }
})

exports.updateShow = catchAsync(async (req, res, next) => {
    // try {
        console.log(req.body);
        const updatedShow = await Show.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        
        if(!updatedShow) {
            return next(new AppError("No show found in that ID", 404));
        }
        

        res.status(200).json({
            status: "success",
            data: {
                updatedShow
            }
        });
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     })
    // }
})

exports.deleteShow = catchAsync(async (req, res, next) => {
    // try {
        const deletedShow = await Show.findByIdAndDelete(req.params.id);
        // await Show.findByIdAndDelete(req.params.id);
        // console.log(deletedShow);
        
        if(!deletedShow) {
            return next(new AppError("No show found in that ID", 404));
        }
        

        res.status(200).json({
            status: "success",
            data: {
                deletedShow
            }
        })
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }
});

exports.getShowStats = catchAsync(async (req, res, next) => {
    // try {
        const stats = await Show.aggregate([
            {
                $match: { age: { $gte: 18 } }
            },
            {
                $group: {
                    _id: null,
                    numUser: { $sum: 1 },
                    avgRating: { $avg: '$rating'},
                    ageSum: { $sum: '$age'},
                    avgAge: { $avg: '$age'},
                    minAge: { $min: '$age'},
                    maxAge: { max: '$age' }
                }
            } 
        ]);
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }
});

