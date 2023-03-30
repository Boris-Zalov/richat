<template>
    <nav>
        <nav class="navbar bg-body-tertiary navbar-expand-lg fixed-top shadow">
            <div class="container-fluid">
                <NuxtLink to="/" class="navbar-brand">
                    <img src="/favicon.ico" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
                    Richat
                </NuxtLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav nav-underline">
                        <NuxtLink to="/about" class="nav-link">About</NuxtLink>
                        <NuxtLink to="/profile" class="nav-link">Profile</NuxtLink>
                    </div>
                </div>

            </div>
        </nav>
    </nav>
</template>

<style lang="scss"></style>
