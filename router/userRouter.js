const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


router
    .route('/')
    .get(userController.getAllUsers)
    // .post(userController.createUser);


router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword); // CHANGED FROM UNDER FORGOET PASSWORD....


router.patch(
    "/updateMyPassword", 
    authController.protect, 
    authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.route(userController.getUserStats);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    // .put(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;
