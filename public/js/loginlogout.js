"use strict"
import axios from "axios"
import { displayAlert } from "./alerts";

export const login = (email, password) => {
    const loginData = { email: email, password: password };
    axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/users/login",
        data: loginData,
    }).then(response => {
        const result = response.data;

        if (result.status === "success") {
            displayAlert("success", "Logged in successefully")
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

export const logout = () => {
    axios({
        method: "GET",
        url: "http://localhost:3000/api/v1/users/logout"
    }).then(response => {
        if (response.data.status === "success") location.reload(true)
    }).catch(error => {
        displayError("error", `Error logging out ${error}`)
    })
};