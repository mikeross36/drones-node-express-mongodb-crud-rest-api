"use strict"
const mongoose = require("mongoose")

const preorderSchema = new mongoose.Schema({
    drone: {
        type: mongoose.Schema.ObjectId,
        ref: "Drone",
        required: [true, "Product name is mandatory!"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User is mandatory"]
    },
    price: {
        type: Number,
        required: [true, "Preorder price has to be defined"]
    },
    // creditCardNum: {
    //     type: String,
    //     required: [true, "Enter credit card number!"],
    // },
    // nameOnCard: {
    //     type: String,
    // },
    // cardExpireDate: {
    //     type: Date,
    //     required: [true, "Entre expiry date!"]
    // },
    // cardSecurityCode: {
    //     type: String,
    //     required: [true, "Entre card security code!"]
    // },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: {virtuals: true}
});

preorderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "drone",
        select: "name"
    })
    next()
})

preorderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name"
    })
    next()
});

const Preorder = mongoose.model("Preorder", preorderSchema)

module.exports = Preorder;