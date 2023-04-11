<script setup>
const { id, full } = defineProps(['id', 'full'])

let loaded = ref(false)
let avatar_src = ref('')
let picture_src = ref('')

const supabase = useSupabaseClient()

const { data: post, error: post_error } = await supabase
    .from('posts')
    .select('title, text, img_url, author_id, users(avatar_url, nickname)')
    .eq('id', id)
    .single()

async function download_image() {
    try {
        const { data: avatar, error: downloadError } = await supabase.storage
            .from('avatars')
            .getPublicUrl(post.users.avatar_url)

        if (downloadError) throw downloadError
        avatar_src.value = avatar.publicUrl
    } catch (downloadError) {
        console.error('Error downloading image: ', downloadError.message)
    }
    try {
        const { data: picture, error: pictureError } = await supabase.storage
            .from('posts')
            .getPublicUrl(post.img_url)

        if (pictureError) throw pictureError
        picture_src.value = picture.publicUrl
    } catch (pictureError) {
        console.error('Error downloading image: ', pictureError.message)
    }
}

await download_image()
loaded.value = true

</script>

<template>
    <div>
        <div v-if="loaded">
            <div class="card mt-5 p-2">
                <div class="card-header d-flex align-items-center">
                    <nuxt-img height="35" width="35" format="webp" quality="80" :src="avatar_src" alt=""
                        style="object-fit: cover;" class="rounded-circle m-3" sizes="sm:45 md:45 lg:45"
                        onerror="this.onerror=null;this.src='https:/\/cdn-icons-png.flaticon.com/512/149/149071.png';" />
                    <h5>{{ post.users.nickname }}</h5>
                </div>
                <div class="text-center">
                    <div class="card-body">
                        <h2 v-if="full" class="card-title m-3">{{ post.title }}</h2>
                        <NuxtLink v-else :to="'/post/' + id" class="link-light link-offset-2" style="text-decoration:none">
                            <h2 class="card-title m-3 text-truncate">{{ post.title }}</h2>
                        </NuxtLink>
                        <p class="card-text" :class="(full) ? '' : 'text-truncate'">{{ post.text }}</p>
                        <nuxt-img v-if="post.img_url" :src="picture_src" class="img-fluid p-2" alt="" loading="lazy" />
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>