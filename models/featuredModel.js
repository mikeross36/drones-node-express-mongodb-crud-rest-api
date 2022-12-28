"use strict"
const mongoose = require("mongoose")
const slugify = require("slugify")

const featuredSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name of featured is mandatory!"],
            unique: true,
            trim: true,
            maxLength: [40, "Drone name must have less then 40 chars"]
        },
        flightTime: {
            type: String,
            required: [true, "Flight time must be defined!"]
        },
        cruisingSpeed: String,
        vehicleMass: String,
        maxPayloadMass: String,
        flightRange: String,
        operatingDifficulty: {
            type: String,
            required: [true, "Opearating dificulty level must be defined!"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty levels are: easy, medium, difficult"
            }
        },
        slug: String,
        price: {
            type: Number,
            required: [true, "Price must be defined"],
        },
        summary: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, "Cover image is mandatory!"]
        },
        images: [String],
        ratingsAverage: {
            type: Number,
            default: 4,
            min: [1, "Ratings must be above 1.0"],
            max: [5, "Rating must be below 5.1"]
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            slecet: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

featuredSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
});

featuredSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "featured",
    localField: "_id"
});

const Featured = mongoose.model("Featured", featuredSchema)

module.exports = Featured;