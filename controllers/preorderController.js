"use strict"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const poseCatch = require("./../utils/poseCatch")
const Drone = require("./../models/droneModel")
const Preorder = require("./../models/preorderModel")
const factory = require("./factoryController")

exports.getCheckoutSession = poseCatch(async (req, res, next) => {
    const drone = await Drone.findById(req.params.droneId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "eur",
                product_data: {
                    name: drone.name,
                    images:[`./../public/images/drones/${drone.imageCover}`]
                },
                unit_amount: drone.price
            },
            quantity: 1
        }],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/?drone=${req.params.droneId}&user=${req.user.id}&price=${drone.price}`,
        cancel_url: `${req.protocol}://${req.get("host")}/drone/${drone.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.droneId,
    })

    res.status(200).json({
        stauts: "success",
        session: session
    })
});

exports.createPreorderCheckout = poseCatch(async (req, res, next) => {
    // temporary & unsafe
    const { drone, user, price } = req.query;

    if (!drone && !user && !price) return next();
    await Preorder.create({ drone, user, price });

    res.redirect(req.originalUrl.split("?")[0])
});

exports.createPreorder = factory.createOne(Preorder)
exports.getPreorder = factory.getOne(Preorder)
exports.getAllPreorders = factory.getAll(Preorder)
exports.updatePreorder = factory.updateOne(Preorder)
exports.deletePreorder = factory.deleteOne(Preorder)

// exports.getCheckoutSession = poseCatch(async (req, res, next) => {
//     const drone = await Drone.findById(req.params.droneId);

//     const droneItems = [{id:1, price: drone.price, name: drone.name}]

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: droneItems.map((droneItem) => {
//             return {
//                 quantity: 1,
//                 price_data: {
//                     currency: "eur",
//                     product_data: {
//                         name: droneItem.name,
//                     },
//                     unit_amount: droneItem.price
//                 }
//             }
//         }),
//         mode: "payment",
//         success_url: `${req.protocol}://${req.get("host")}/`,
//         cancel_url: `${req.protocol}://${req.get("host")}/drone/${drone.slug}`,
//         customer_email: req.user.email,
//         client_reference_id: req.params.droneId,
//     })

//     res.status(200).json({
//         stauts: "success",
//         session: session
//     })
// });
