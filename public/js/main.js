"use strict"
import "core-js/actual";
import "regenerator-runtime/runtime";
import { toggleMobMenu, toggleSearch, closeNavMenu, filterSearch, headerOnScroll } from "./navFeatures"
import { navGlobals, loginFormGlobals, qs, signupFormGlobals, accountGlobals, preorderGlobals } from "./utils"
import { login, logout } from "./loginlogout"
import { signup } from "./signup"
import { updateUserData, updateUserPassword } from "./updateSettings"
import { preorderProduct } from "./stripe";

const { navMenu, navSearchForm, header, logOutBtn } = navGlobals();
const { loginForm } = loginFormGlobals();
const { signupForm } = signupFormGlobals();
const { userDataForm, userPasswordForm, savePasswordBtn } = accountGlobals();
const { preorderBtn } = preorderGlobals();

if (navMenu) {
    toggleMobMenu()
    closeNavMenu()
};

if (navSearchForm) {
    toggleSearch()
    filterSearch()
};

if (header) {
    window.onscroll = () => {
        headerOnScroll()
    }
};

if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault()
        const email = qs("#email").value;
        const password = qs("#password").value;

        login(email, password)
    })
};

if(logOutBtn) logOutBtn.addEventListener("click", logout)

if (signupForm) {
    signupForm.addEventListener("submit", e => {
        e.preventDefault()
        const name = qs("#name").value;
        const email = qs("#email").value;
        const password = qs("#password").value;
        const passwordConfirm = qs("#password-confirm").value;

        signup(name, email, password, passwordConfirm)
    })
}

if (userDataForm) {
    userDataForm.addEventListener("submit", e => {
        e.preventDefault()
        const form = new FormData();
        form.append("name", qs("#name").value);
        form.append("email", qs("#email").value);
        form.append("photo", qs("#photo").files[0])

        updateUserData(form)
    })
}

if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", e => {
        e.preventDefault()
        savePasswordBtn.textContent = "Updating...";

        const loginPassword = qs("#login-password").value;
        const password = qs("#password").value;
        const passwordConfirm = qs("#password-confirm").value;

        updateUserPassword({ loginPassword, password, passwordConfirm })
        
        savePasswordBtn.textContent = "Save password";
        qs("#login-password").value = "";
        qs("#password").value = "";
        qs("#password-confirm").value = "";
    })
};

if (preorderBtn) {
    preorderBtn.addEventListener("click", e => {
        e.target.textContent = "Processing...";
        const { productId } = e.target.dataset;
        
        preorderProduct(productId);
    })
};

