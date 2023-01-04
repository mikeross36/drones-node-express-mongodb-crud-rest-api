"use strict"
import axios from "axios";
import { displayAlert } from "./alerts"
import { loadStripe } from '@stripe/stripe-js';
// const stripe = Stripe("pk_test_51MIVF1HiUrG1dfcH8HuPCxW9xcCFFRHwIexNVNTVHjoWUtQWlYRjWYqpRJMyviloxKPE3pDQsL2w8f08ZYy7qmH000Sf33z9Ef")

export const preorderProduct = async droneId => {
    const stripe = await loadStripe("pk_test_51MIVF1HiUrG1dfcH8HuPCxW9xcCFFRHwIexNVNTVHjoWUtQWlYRjWYqpRJMyviloxKPE3pDQsL2w8f08ZYy7qmH000Sf33z9Ef")
    try {
        const session = await axios(`/api/v1/preorders/checkout-session/${droneId}`)
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    }
    catch (error) {
        displayAlert("error", error)
    }
};