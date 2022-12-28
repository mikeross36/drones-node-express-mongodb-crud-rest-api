"use strict"
import axios from "axios";
import { displayAlert } from "./alerts"

export const updateUserData = (data) => {
    axios({
        method: "PATCH",
        url: "http://localhost:3000/api/v1/users/update-me",
        data: data
    }).then(response => {
        if (response.data.status === "success") {
            displayAlert("success", "Updated successfully!")
        }
        return response
    }).catch(error => {
        displayAlert("error", error.response.data.message)
    })
};

export const updateUserPassword = (data) => {
    axios({
        method: "PATCH",
        url: "http://localhost:3000/api/v1/users/update-password",
        data: data
    }).then(response => {
        const result = response.data;
        if (result.status === "success") {
            displayAlert("success", "Password updated successfully")
        }
        return result;
    }).catch(error => {
        displayAlert("error", error.response.data.message)
    })
};