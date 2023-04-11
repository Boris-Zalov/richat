<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const { data, error } = await supabase
    .from('users')
    .select('nickname, avatar_url')
    .eq('id', user.value.id)

if (!data[0].avatar_url) {
    data[0].avatar_url = "https:/\/cdn-icons-png.flaticon.com/512/149/149071.png"
}


async function signOut() {
    try {
        let { error } = await supabase.auth.signOut()
    } catch (error) {
        alert(error.message)
    }
}
</script>

<template>
    <div>
        <NuxtLink to="/profile">
            <nuxt-img height="45" width="45" sizes="sm:45 md:45 lg:45" format="webp" quality="80" :src="data[0].avatar_url"
                alt="" style="object-fit: cover;" class="rounded-circle"
                onerror="this.onerror=null;this.src='https:/\/cdn-icons-png.flaticon.com/512/149/149071.png';" />
            <a class="mx-3">{{ data[0].nickname }}</a>
        </NuxtLink>
        <button class="btn btn-outline-danger btn-sm mx-2" @click="signOut">Sign out</button>
    </div>
</template>