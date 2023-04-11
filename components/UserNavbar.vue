<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

let avatar_src = ref('')
const { data, error } = await supabase
    .from('users')
    .select('nickname, avatar_url')
    .eq('id', user.value.id)

try {
    const { data: avatar, error: downloadError } = await supabase.storage
        .from('avatars')
        .getPublicUrl(data[0].avatar_url)

    if (downloadError) throw downloadError
    avatar_src.value = avatar.publicUrl
    console.log(avatar_src.value)
} catch (downloadError) {
    console.error('Error downloading image: ', downloadError.message)
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
            <img height="45" width="45" sizes="sm:45 md:45 lg:45" :src="avatar_src.value"
                alt="" style="object-fit: cover;" class="rounded-circle"
                onerror="this.onerror=null;this.src='https:/\/cdn-icons-png.flaticon.com/512/149/149071.png';" />
            <a class="mx-3">{{ data[0].nickname }}</a>
        </NuxtLink>
        <button class="btn btn-outline-danger btn-sm mx-2" @click="signOut">Sign out</button>
    </div>
</template>