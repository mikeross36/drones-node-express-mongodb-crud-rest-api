"use strict"
import { qs } from "./utils"

export const hideAlert = () => {
    const element = qs(".alert")
    if (element) element.parentElement.removeChild(element)
};

export const displayAlert = (type, message) => {
    hideAlert()
    const alert = `<div class="alert alert-${type}">${message}</div>`;
    qs("body").insertAdjacentHTML("afterbegin", alert)
    const timer = setTimeout(() => {
        hideAlert()
    }, 3000)
    return () => {
        clearTimeout(timer)
    }
};