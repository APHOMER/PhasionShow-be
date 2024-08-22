const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

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
