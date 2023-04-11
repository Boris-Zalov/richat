<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

let avatar_src = ref('')
let loaded = ref(false)

const { data, error } = await supabase
    .from('users')
    .select('nickname, avatar_url')
    .eq('id', user.value.id)
    .single()

async function download_image() {
    try {
        const { data: avatar, error: downloadError } = await supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url)

        if (downloadError) throw downloadError
        avatar_src.value = avatar.publicUrl
    } catch (downloadError) {
        console.error('Error downloading image: ', downloadError.message)
    }
}

await download_image()

loaded.value = true
async function signOut() {
    try {
        let { error } = await supabase.auth.signOut()
    } catch (error) {
        alert(error.message)
    }
}

</script>

<template>
    <div v-if="loaded">
        <NuxtLink to="/profile">
            <nuxt-img v-if="avatar_src" format="webp" height="45" width="45" sizes="sm:45 md:45 lg:45" :src="avatar_src" alt=""
                style="object-fit: cover;" class="rounded-circle" />
            <a class="mx-3">{{ data.nickname }}</a>
        </NuxtLink>
        <button class="btn btn-outline-danger btn-sm mx-2" @click="signOut">Sign out</button>
    </div>
</template>