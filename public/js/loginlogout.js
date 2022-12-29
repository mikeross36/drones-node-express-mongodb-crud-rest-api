"use strict"
import axios from "axios"
import { displayAlert } from "./alerts";

export const login = (email, password) => {
    const loginData = { email: email, password: password };
    axios({
        method: "POST",
        url: "/api/v1/users/login",
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
        url: "/api/v1/users/logout"
    }).then(response => {
        const result = response.data;
        
        if (result.data.status === "success") {
            return location.reload(true)
        }
        return result;
    }).catch(error => {
        displayAlert("error", `Error logging out ${error}`)
    })
};