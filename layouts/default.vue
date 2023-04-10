<template>
    <div id="bg" class="bg-dark">
        <div class="container-md mt-5 bg-dark" data-bs-theme="dark" id="page-content">
            <Navbar />
            <div id="main" data-bs-theme="dark">
                <slot />
            </div>
        </div>
    </div>
</template>

<style>
html {
    height: 100%;
}

body {
    height: 100%;
    color: white !important;
}

#__nuxt {
    height: 100%;
}

#bg {
    min-height: 100%;
    height: auto;
}

#page-content {
    height: 100%;
}

#main {
    min-height: 100%;
    height: auto;
    padding-top: 40px;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>