"use strict"
const poseCatch = require("./../utils/poseCatch")
const ErrorResponse = require("./../utils/ErrorResponse")
const Drone = require("./../models/droneModel")
const Featured = require("./../models/featuredModel")
const Review = require("./../models/reviewModel")
const Preorder = require("./../models/preorderModel")

exports.getMain = poseCatch(async (req, res, next) => {
    const products = await Drone.find()
    const featureds = await Featured.find()

    if (!products || !featureds) {
        return next(new ErrorResponse("Drones not found!", 404))
    }
    res.status(200).render("main", {
        products: products,
        featureds: featureds
    })
});

exports.getProduct = poseCatch(async (req, res, next) => {
    const product = await Drone.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user"
    })
    if (!product) {
        return next(new ErrorResponse("Product not found!", 404))
    }
    res.status(200).render("product", {
        title: `${product.name}`,
        product: product
    })
});

exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Log in into your account"
    })
};

exports.getSignupForm = (req, res) => {
    res.status(200).render("signup", {
        title: "Signup to create account"
    })
};

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your account"
    })
};

exports.getCheckoutForm = (req, res) => {
    res.status(200).render("checkout", {
        title: "checkout"
    })
}

exports.getFeatured = poseCatch(async (req, res, next) => {
    const featured = await Featured.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user"
    })
    if (!featured) {
        return next(new ErrorResponse("Featured not found!", 404))
    }
    res.status(200).render("featured", {
        featured: featured
    })
});

exports.getReviews = poseCatch(async (req, res, next) => {
    const reviews = await Review.find()
    if (!reviews) {
        return next(new ErrorResponse("Reviews not found!", 404))
    }
    res.status(200).render("reviews", {
        reviews: reviews
    })
});

exports.getMyPreorders = poseCatch(async (req, res, next) => {
    const preorders = await Preorder.find({ user: req.user.id });
    // instead of virtual populate result is the same
    const droneIds = preorders.map(item => item.drone)
    const products = await Drone.find({ _id: { $in: droneIds } });

    res.status(200).render("preorders", {
        title: "My preorders",
        products: products
    })
});

// exports.getPreorderCard = poseCatch(async (req, res, next) => {
//     const product = await Drone.findOne({ slug: req.params.slug })
//     if (!product) {
//         return next(new ErrorResponse("Product not found", 404))
//     }
//     res.status(200).render("preorderCard", {
//         product: product
//     })
// });