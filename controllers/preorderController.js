"use strict"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const poseCatch = require("./../utils/poseCatch")
const Drone = require("./../models/droneModel")
const Preorder = require("./../models/preorderModel")
const factory = require("./factoryController")
const User = require("./../models/userModel")

exports.getCheckoutSession = poseCatch(async (req, res, next) => {
    const drone = await Drone.findById(req.params.droneId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "eur",
                product_data: {
                    name: drone.name,
                    images:[`${req.protocol}://${req.get("host")}/images/drones/${drone.imageCover}`]
                },
                unit_amount: drone.price
            },
            quantity: 1
        }],
        mode: "payment",
        // success_url: `${req.protocol}://${req.get("host")}/my-preorders/?drone=${req.params.droneId}&user=${req.user.id}&price=${drone.price}`,
        success_url: `${req.protocol}://${req.get("host")}/my-preorders`,
        cancel_url: `${req.protocol}://${req.get("host")}/drone/${drone.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.droneId,
    })

    res.status(200).json({
        stauts: "success",
        session: session
    })
    console.log(session)
});

exports.createPreorderCheckout = async session => {
    const drone = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.line_items[0].unit_amount;
    await Preorder.create({ drone, user, price });
};

exports.webhookCheckout = (req, res, next) => {
    let event;
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        const signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            )
        }
        catch(error){
            return res.status(400).send(`Webhook error: ${error.message}`)
        }
    }

    if (event.type === "checkout.session.completed") {
        createPreorderCheckout(event.data.object)
    }

    res.status(200).json({ received: true });
};

exports.createPreorder = factory.createOne(Preorder)
exports.getPreorder = factory.getOne(Preorder)
exports.getAllPreorders = factory.getAll(Preorder)
exports.updatePreorder = factory.updateOne(Preorder)
exports.deletePreorder = factory.deleteOne(Preorder)



