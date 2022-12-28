"use strict"
const express = require("express")
const authConteroller = require("./../controllers/authConteroller")
const reviewController = require("./../controllers/reviewController")

const router = express.Router({ mergeParams: true });

router.use(authConteroller.tokenProtect)

router.route("/")
    .get(reviewController.getAllReviews)
    .post(authConteroller.restrictTo("user","admin"),reviewController.setDroneUserIds, reviewController.createReview)

router.route("/:id")
    .get(reviewController.getReview)
    .patch(authConteroller.restrictTo("user","admin"), reviewController.updateReview)
    .delete(authConteroller.restrictTo("user","admin"), reviewController.deleteReview)


module.exports = router;