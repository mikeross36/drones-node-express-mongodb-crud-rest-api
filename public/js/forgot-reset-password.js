"use strict"
import axios from "axios"
import { displayAlert } from "./alerts"

export const forgot = (email) => {
    const userEmail = { email: email }
    axios({
        method: "POST",
        url: "/api/v1/users/forgot-password",
        data: userEmail
    }).then(response => {
        const result = response.data;
        if (result.status === "success") {
            displayAlert("success", `Verification email sent to ${email}`)
            const timer = setTimeout(() => {
                location.assign("/")
            }, 1500)
            return () => {
                clearTimeout(timer)
            }
        }
    }).catch(error => {
        displayAlert("error", error.response.data.message)
    })
};

export const reset = (password, passwordConfirm, token) => {
    axios({
        method: "PATCH",
        url: `/api/v1/users/reset-password/${token}`,
        data: {
            password: password,
            passwordConfirm: passwordConfirm
        }
    }).then(response => {
        const result = response.data;
        if (result.status === "success") {
            displayAlert("success", "Password reset successfully")
            const timer = setTimeout(() => {
                location.assign("/me")
            }, 1500)
            return () => {
                clearTimeout(timer)
            }
        }
    }).catch(error => {
        displayAlert("error", error.response.data.message)
    })
};
