const express = require('express');
const router = express.Router();

const showController = require("../controllers/showController");
const authController = require("../controllers/authController");

// router.route(showController.getShowStats);

router
    .route('/')
    .get(authController.protect, showController.getAllShow)
    // .get(showController.getAllShow)
    .post(showController.createShow);

    
router
    .route('/:id')
    .get(showController.getShow)
    .patch(showController.updateShow)
    // .put(showController.updateshow)
    .delete(
        authController.protect, 
        authController.restrictTo('event-planner', 'admin', 'ceo'), 
        showController.deleteShow
    );


module.exports = router;
