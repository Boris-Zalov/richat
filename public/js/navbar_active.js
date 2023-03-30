window.addEventListener('load', () => {
    const active_routes = document.querySelectorAll(".router-link-exact-active");
    active_routes.forEach((element) => {
        element.classList.add('active')
    });
})

window.addEventListener('click', () => {
    const active_routes = document.querySelectorAll(".router-link-exact-active");
    active_routes.forEach((element) => {
        element.classList.add('active')
    });
})