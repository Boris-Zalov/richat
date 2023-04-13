<script setup>
const route = useRoute()

let loaded = ref(false)
let avatar_src = ref('')

const supabase = useSupabaseClient()

const { data: user, error: user_error } = await supabase
    .from('users')
    .select('avatar_url, nickname, bio')
    .eq('id', route.params.id)
    .single()


const { data: posts, error: posts_error } = await supabase
    .from('posts')
    .select('id')
    .eq('author_id', route.params.id)
    .order('created_at', { ascending: false })


async function download_image() {
    try {
        const { data: avatar, error: downloadError } = await supabase.storage
            .from('avatars')
            .getPublicUrl(user.avatar_url)

        if (downloadError) throw downloadError
        avatar_src.value = avatar.publicUrl
    } catch (downloadError) {
        console.error('Error downloading image: ', downloadError.message)
    }
}

await download_image()
loaded.value = true


</script>

<template>
    <div v-if="loaded">
        <div class="d-flex align-items-center">
            <nuxt-img v-if="avatar_src" format="webp" height="145" width="145" sizes="sm:145 md:145 lg:145"
                :src="avatar_src" alt="" style="object-fit: cover;" class="rounded-circle" />
            <h1 class="mx-3">{{ user.nickname }}</h1>
        </div>
        <p calss="m-4">{{ user.bio }}</p>

        <div v-if="posts">
            <h3>Posts made by {{ user.nickname }}:</h3>
            <div v-for="post in posts" :key="post.id">
                <LazyPost :id="post.id" :full="false" />
            </div>
        </div>

    </div>
</template>