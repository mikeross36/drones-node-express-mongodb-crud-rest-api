"use strict"
const mongoose = require("mongoose")
const slugify = require("slugify")

const droneSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is mandatory"],
            unique: true,
            trim: true,
        },
        flightTime: {
            type: String,
            required: [true, "Flight time is mandatory"]
        },
        cruisingSpeed: String,
        vehicleMass: String,
        maxPayloadMass: String,
        flightRange: String,
        operatingDifficulty: {
            type: String,
            required: [true, "Operating dofficulty level is mandatory"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty levels are: easy, medium, difficult"
            }
        },
        slug: String,
        price: {
            type: Number,
            required: [true, "Price must be defined"]
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
            required: [true, "Cover image is mandatory"]
        },
        images: [String],
        ratingsAverage: {
            type: Number,
            default: 4,
            min: [1, "Ratings nust be above 1.0"],
            max: [5, "Raings must be below 5.1"]
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        pilots: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            }
        ]
    }, {
        toJSON: { virtuals: true },
        toObject: {virtuals: true}
    }
);

droneSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "drone",
    localField: "_id"
});

droneSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
});

droneSchema.pre(/^find/, function (next) {
    this.populate({
        path: "pilots",
        select: "-__v -passwordChangedAt"
    })
    next();
});

const Drone = mongoose.model("Drone", droneSchema)

module.exports = Drone;