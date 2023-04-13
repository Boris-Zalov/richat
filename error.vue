<script setup>
const props = defineProps({
    error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <div id="bg" class="bg-dark">
        <div class="bg-dark" data-bs-theme="dark" id="page-content">
            <Navbar />
            <div class="d-flex aligns-items-center justify-content-center min-vh-100 min-vw-100">
                <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
                    <h1 class="p-2">Ooops!</h1>
                    <p class="p-2">Something went wrong, maybe page you are trying yo visit does not exist, or we just have
                        problems with servers((</p>
                    <NuxtLink to="/" type="button" class="btn btn-success">Return to the main page</NuxtLink>
                </div>

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