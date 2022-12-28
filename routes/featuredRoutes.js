"use strict"
const express = require("express")
const reviewRouter = require("./reviewReoutes")
const featuredController = require("./../controllers/featuredController")
const authController = require("./../controllers/authConteroller")

const router = express.Router()

router.use("/:featuredId/reviews", reviewRouter)

router.route("/")
    .get(authController.tokenProtect, featuredController.getAllFeatured)
    .post(authController.tokenProtect, authController.restrictTo("admin"), featuredController.createFeatured)

router.route("/:id")
    .get(authController.tokenProtect, featuredController.getFeatured)
    .patch(authController.tokenProtect, authController.restrictTo("admin"), featuredController.updateFeatured)
    .delete(authController.tokenProtect, authController.restrictTo("admin"), featuredController.deleteFeatured)

module.exports = router;