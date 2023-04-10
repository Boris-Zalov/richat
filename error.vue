<template>
    <div>
        <Navbar />
        <div class="d-flex aligns-items-center justify-content-center min-vh-100 min-vw-100">
            <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
                <h1 class="p-2">Ooops!</h1>
                <p class="p-2">Something went wrong</p>
                <NuxtLink to="/" type="button" class="btn btn-success">Return to the main page</NuxtLink>
            </div>

        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>