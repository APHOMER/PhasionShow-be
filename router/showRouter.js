const express = require('express');
const router = express.Router();

const showController = require("../controllers/showController");

// router.route(showController.getShowStats);

router
    .route('/')
    .get(showController.getAllShow)
    .post(showController.createShow);

router
    .route('/:id')
    .get(showController.getShow)
    .patch(showController.updateShow)
    // .put(showController.updateshow)
    .delete(showController.deleteShow);


module.exports = router;
