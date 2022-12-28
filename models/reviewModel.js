"use strict"
const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review title is mandatory!"]
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        drone: {
            type: mongoose.Schema.ObjectId,
            ref: "Drone",
            // required: [true, "A review must be a drone related!"]
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "A review must be a user related!"]
        },
        featured: {
            type: mongoose.Schema.ObjectId,
            ref: "Featured",
            // required: [true, "A review must be a featured related!"]
        }
    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name photo"
    })
    next()
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "drone",
        select: "name"
    })
    next()
});

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "featured",
        select: "name"
    })
    next()
});


const Review = mongoose.model("Review", reviewSchema)

module.exports = Review;