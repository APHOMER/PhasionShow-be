const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


router.get('/', (req, res, next) => {
    console.log('Welcome to the PHASIONSHOW home page!')
    res.send('Welcome to the PHASIONSHOW home page!');
    // next();
  });

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);




router.patch(
    "/updateMyPassword", 
    authController.protect, 
    authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.route(userController.getUserStats);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    // .put(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;
