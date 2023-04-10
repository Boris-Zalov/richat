<script setup>
const user = useSupabaseUser()

</script>

<template>
    <div>
        <ChangeProfile v-if="user" />
        <Auth v-else />
    </div>
</template>
