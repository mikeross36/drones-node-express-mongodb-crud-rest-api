"use strict"
import {navGlobals, qs, qsa} from "./utils"

export const toggleMobMenu = () => {
    const { navMenu, navToggle, navClose, header } = navGlobals();

    if (navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.add("show-menu")
            closeSearchForm()
        })
        navClose.addEventListener("click", () => {
            navMenu.classList.remove("show-menu")
        })
        
        const closeSearchForm = () => {
            const navSearchForm = qs(".nav__search-form")
            if (navSearchForm.classList.contains("active-form")) {
                return navSearchForm.classList.remove("active-form")
            }
        }
    }
};

export const toggleSearch = () => {
    const { searchBtn, navSearchForm, closeSearch, searchInput } = navGlobals();
    if (navSearchForm) {
        searchBtn.addEventListener("click", () => {
            navSearchForm.classList.toggle("active-form")
        })
        closeSearch.addEventListener("click", () => {
            navSearchForm.classList.remove("active-form")
            searchInput.value = "";
        })
    }
};

export const closeNavMenu = () => {
    const navItems = qsa(".nav__item")
    const navMenu = qs("#nav-menu")

    if (navMenu) {
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navMenu.classList.remove("show-menu")
            })
        })
    }
};

export const filterSearch = () => {
    const input = qs("#nav-search-input")
    const searchTerm = input.value.trim().toLowerCase()
    const sections = qsa("section")

    sections.forEach(section => {
        if (searchTerm && section.id.toString().toLowerCase().indexOf(searchTerm) > -1) {
            document.getElementById(section.id).scrollIntoView()
        }
    })
};

export const headerOnScroll = () => {
    const header = qs("#header")

    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        header.style.background = "#eceaea";
        header.style.boxShadow = "0 1px 4px #0a0a0a4d";
    }
    else if (document.body.scrollTop === 0 || document.documentElement.scrollTop === 0) {
        header.style.background = "transparent";
        header.style.boxShadow = "none"
    }
};