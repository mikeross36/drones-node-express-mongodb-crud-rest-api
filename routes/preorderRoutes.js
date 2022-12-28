"use strict"
const express = require("express")
const authController = require("./../controllers/authConteroller")
const preorderController = require("./../controllers/preorderController")

const router = express.Router()

router.use(authController.tokenProtect)

router.get("/checkout-session/:droneId", authController.tokenProtect, preorderController.getCheckoutSession)

router.use(authController.restrictTo("admin","user"))

router.route("/")
    .get(preorderController.getAllPreorders)
    .post(preorderController.createPreorder)

router.route("/:id")
    .get(preorderController.getPreorder)
    .patch(preorderController.updatePreorder)
    .delete(preorderController.deletePreorder)

module.exports = router;