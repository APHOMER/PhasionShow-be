
const User = require("../models/userModel.js");


exports.createUser = async (req, res) => {
    try {
        
        const newUser = await User.create(req.body);
    
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
        
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
};

exports.getAllUsers = async (req, res) => { 
    try { 
        //  BUILDING QUERY
        console.log(req.query);

        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el]);

        // 2) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$$(match)`);
        console.log(JSON.parse(queryStr));

        // EXECUTE QUERY
        const query = User.find(JSON.parse(queryStr));

        // const users = await User.find(queryObj);    ; 
        const users = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                users
            }
        });
    
    // let query = User.find(JSON.parse(queryStr));
        
    // FIELD LIMITING
    // if(req.query.fields){
    //     const fields = req.query.fields(",").join(" ");
    //     query = query.select(fields);
    // } else {
    //     query = query.select(-__v);
    // }
        
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    } 
}

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


