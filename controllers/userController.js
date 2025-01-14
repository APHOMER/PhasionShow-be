const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError");


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.createUser = async (req, res) => {
    try {
        
        const newUser = await User.create(req.body);

        console.log(newUser);

        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
        
    } catch (error) {
        console.log(error);

        res.status(400).json({
            status: "fail",
            message: error
        })
    }
};

exports.getAllUsers = catchAsync(async (req, res) => {
    try {
        
        const users = await User.find();
    
        res.status(200).json({
            status: "success",
            data: {
                users
            }

        })
    } catch (error) {

        console.log(error);

        res.status(400).json({
            status: "fail",
            message: error
        });
    };
});

// exports.getAllUsers1 = async (req, res) => { 
//     try { 
//         //  BUILDING QUERY
//         console.log(req.query);

//         const queryObj = { ...req.query };

//         const excludeFields = ["page", "sort", "limit", "fields"];
//         excludeFields.forEach(el => delete queryObj[el]);

//         // 2) ADVANCED FILTERING
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$$(match)`);
//         console.log(JSON.parse(queryStr));

//         const query = User.find(JSON.parse(queryStr));

//         // const users = await User.find(queryObj); 
        
//     // 2) SORTING
//     if(req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(" ");
//         query = query.sort(sortBy);
//     }else {
//         query = query.sort("-createdAt")
//     };
         
//     // FIELD LIMITING
//     if(req.query.fields){
//         const fields = req.query.fields(",").join(" ");
//         query = query.select(fields);
//     } else {
//         query = query.select(-__v);
//     }

//     // PAGINATION
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     if(req.query.page) {
//         const numUsers = await User.countDocuments();
//         if(skip >= numUsers) throw new Error("This page does not exist yet");
//     };


//     // EXECUTE QUERY   ; 
//     const users = await query;

//         // SEND RESPONSE
//         res.status(200).json({
//             status: "success",
//             results: users.length,
//             data: {
//                 users
//             }
//         });
        
//         console.log(users);
            
//     } catch (err) {
//         console.log(err);

//         res.status(400).json({
//             status: "fail",
//             message: err
//         });
//     } 
// }

exports.updateMe = async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    // 1) Create error if user POSTs password data
    if(password || confirmPassword) {
        return next(new AppError("This route is not for updating password, Please go to /updateMyPassword", 400));
    }

    // 2) filtered out unwanted fields that are not allowed to be updated.
    const filteredBody = filterObj(req.body, 'name', 'email', 'userPicture');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(req.user.id, { active: false });
    console.log(user);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = async(req, res) => {
    try {

        const user = await User.findById(req.params.id);
        console.log("current user",user);
        res.status(200).json({
            status: "success",
            data: {
                user
            }
        });

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        console.log(req.body);
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                updatedUser
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        // const deletedUser = await User.findByIdAndDelete(req.params.id);
        
         await User.findByIdAndDelete(req.params.id);
        // console.log(deletedUser);

        res.status(200).json({
            status: "success",
            data: {
                deletedUser
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
}

// exports.getUserStats = async (req, res) => {
//     try {
//         const stats = await User.aggregate([
//             {
//                 $match: { age: { $gte: 18 } }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     numUser: { $sum: 1 },
//                     avgRating: { $avg: '$rating'},
//                     ageSum: { $sum: '$age'},
//                     avgAge: { $avg: '$age'},
//                     minAge: { $min: '$age'},
//                     maxAge: { max: '$age' }
//                 }
//             } 
//         ]);
//     } catch (err) {
//         res.status(404).json({
//             status: "fail",
//             message: err
//         });
//     }
// }

