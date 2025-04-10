function hideMenu() {
    let menuOpen = document.getElementById('nav-check').checked;


    if (menuOpen === true) {
        document.getElementById('nav-check').checked = false;
    }
}

window.addEventListener("scroll", hideMenu);