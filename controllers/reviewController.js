"use strict"
const Review = require("./../models/reviewModel")
const factory = require("./factoryController")

exports.setDroneUserIds = (req, res, next) => {
    if (!req.body.drone || !req.body.featured) {
        req.body.drone = req.params.droneId;
        req.body.featured = req.params.featuredId
    }
    // if (!req.body.drone) req.body.drone = req.params.droneId;
    if (!req.body.user) req.body.user = req.user.id;
    next()
};

exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review, {path: "user"})
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)