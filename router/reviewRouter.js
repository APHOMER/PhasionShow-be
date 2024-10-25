const expres = require('express');
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = expres.Router();

router
    .route('/')
    .get(reviewController.getAllReview)
    .post(
        authController.protect, 
        authController.restrictTo('user'), 
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReviewById)
    // .patch(reviewController.updatedReview)
    // .delete()


module.exports = router;


