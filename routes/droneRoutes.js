"use strict"
const express = require("express")
const droneController = require("./../controllers/droneController")
const authController = require("./../controllers/authConteroller")
const reviewRouter = require("./reviewReoutes")

const router = express.Router();

router.use("/:droneId/reviews", reviewRouter)

router.route("/")
    .get(authController.tokenProtect, droneController.getAllDrones)
    .post(authController.tokenProtect, authController.restrictTo("admin"), droneController.createDrone)

router.route("/:id")
    .get(authController.tokenProtect, droneController.getDrone)
    .patch(authController.tokenProtect, authController.restrictTo("admin"), droneController.updateDrone)
    .delete(authController.tokenProtect, authController.restrictTo("admin"), droneController.deleteDrone)

module.exports = router;