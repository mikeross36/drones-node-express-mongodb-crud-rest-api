const express = require("express")
const viewsController = require("./../controllers/viewsController")
const authController = require("./../controllers/authConteroller")
const preorderController = require("./../controllers/preorderController")

const router = express.Router()

router.get("/signup", viewsController.getSignupForm)

router.get("/", authController.isUserLoggendIn, viewsController.getMain)
router.get("/product/:slug", authController.isUserLoggendIn, viewsController.getProduct)
router.get("/login", authController.isUserLoggendIn, viewsController.getLoginForm)
router.get("/me", authController.tokenProtect, viewsController.getAccount)
router.get("/featured/:slug", authController.isUserLoggendIn, viewsController.getFeatured)
router.get("/reviews", authController.isUserLoggendIn, viewsController.getReviews)
router.get("/my-preorders", authController.tokenProtect, viewsController.getMyPreorders)

module.exports = router;