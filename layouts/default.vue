<template>
    <div class="container-fluid bg-dark" data-bs-theme="dark" id="page-content">
        <div class="container mt-5">
            <Navbar />
            <div id="main">
                <slot />
            </div>
            <Footer />
        </div>

    </div>
</template>

<style>
html {
    height: 100%;
}

body {
    background-color: black;
    color: white;
    height: 100%;
}

#main {
    padding-top: 40px;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>