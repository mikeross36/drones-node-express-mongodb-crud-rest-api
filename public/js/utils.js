"use strict"

export function qs(selector, parent = document) {
    return parent.querySelector(selector)
};

export function qsa(selector, parent = document) {
    return parent.querySelectorAll(selector)
};

export function navGlobals() {
    const navMenu = qs("#nav-menu");
    const navToggle = qs("#nav-toggle");
    const navClose = qs("#nav-close")
    const searchBtn = qs(".nav__search")
    const navSearchForm = qs(".nav__search-form")
    const closeSearch = qs(".close__search-btn")
    const searchInput = qs("#nav-search-input")
    const header = qs("#header")
    const logOutBtn = qs(".nav__link-logout")

    return {navMenu, navToggle, navClose, searchBtn, navSearchForm, closeSearch, searchInput, header, logOutBtn}
};

export function loginFormGlobals() {
    const loginForm = qs(".login__form")
    return {loginForm}
};

export function signupFormGlobals() {
    const signupForm = qs(".signup__form")
    return {signupForm}
};

export function accountGlobals() {
    const userDataForm = qs(".form__user-data")
    const userPasswordForm = qs(".form__user-password")
    const savePasswordBtn = qs(".save__password-btn")

    return {userDataForm, userPasswordForm, savePasswordBtn}
};

export function preorderGlobals() {
    const preorderForm = qs(".preorder__form")
    const preorderBtn = qs("#preorder-product")

    return {preorderBtn, preorderForm}
};