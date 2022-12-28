"use strict"
import axios from "axios"
import "core-js/actual"
import "regenerator-runtime/runtime"
import {displayAlert} from "./alerts"

export const signup = (name, email, password, passwordConfirm) => {
    const signupData = { name, email, password, passwordConfirm }
    axios({
        method: "POST",
        url: "/api/v1/users/signup",
        data: signupData
    }).then(response => {
        const result = response.data;
        if (result.status === "success") {
            displayAlert("success", "Signup successfully")
            const timer = setTimeout(() => {
                location.assign("/")
            }, 1500)
            return () => {
                clearTimeout(timer)
            }
        }
        return result;
    }).catch(error => {
        displayAlert("error", error.response.data.message)
    })
};