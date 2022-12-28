"user strict"
const Featured = require("./../models/featuredModel")
const factory = require("./factoryController")

exports.getAllFeatured = factory.getAll(Featured)
exports.getFeatured = factory.getOne(Featured, { path: "reviews" })
exports.createFeatured = factory.createOne(Featured)
exports.updateFeatured = factory.updateOne(Featured)
exports.deleteFeatured = factory.deleteOne(Featured)