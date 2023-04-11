<script setup>
const user = useSupabaseUser()
</script>

<template>
    <nav style="height: 55;">
        <nav class="navbar bg-body-tertiary navbar-expand-lg fixed-top shadow">
            <div class="container-fluid">
                <NuxtLink to="/" class="navbar-brand">
                    <nuxt-img src="/icon.png" format="webp" alt="Logo" class="d-inline-block align-text-top mx-1" />
                    Richat
                </NuxtLink>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
                    aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>


                <div class="collapse navbar-collapse" id="navbarToggler">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <NuxtLink to="/about" class="nav-link">About</NuxtLink>
                        </li>
                        <li class="nav-item">
                            <NuxtLink to="/profile" class="nav-link">Profile</NuxtLink>
                        </li>
                        <li class="nav-item">
                            <NuxtLink to="/create-new-post" class="nav-link">Create new post</NuxtLink>
                        </li>
                    </ul>
                    <div class="d-flex">
                        <div v-if="user">
                            <UserNavbar />
                        </div>
                        <div v-else class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                            <NuxtLink to="/sign-in" type="button" class="btn btn-outline-success">Sign in</NuxtLink>
                            <NuxtLink to="/sign-up" type="button" class="btn btn-outline-success">Sign up</NuxtLink>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    </nav>
</template>

<style lang="scss">
.router-link-exact-active {
    font-weight: bold;
    color: white;
}
</style>
