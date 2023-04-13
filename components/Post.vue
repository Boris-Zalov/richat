<script setup>
const { id, full } = defineProps(['id', 'full'])

let loaded = ref(false)
let avatar_src = ref('')
let picture_src = ref('')

let liked = ref(false)
let like_count = ref(0)

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const { data: post, error: post_error } = await supabase
    .from('posts')
    .select('title, text, img_url, author_id, created_at, users(avatar_url, nickname)')
    .eq('id', id)
    .single()

let creation_date = new Date(Date.parse(post.created_at))

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

async function check_if_liked() {
    const { data: user_likes, error: user_likes_error } = await supabase
        .from('post_likes')
        .select()
        .eq('author_id', user.value.id)
        .eq('post_id', id)

    if (user_likes.length > 0) {
        liked.value = true
    } else {
        liked.value = false
    }

}


async function update_likes() {
    if (liked.value) {
        const { data: l, error: e } = await supabase
            .from('post_likes')
            .delete()
            .eq('author_id', user.value.id)
            .eq('post_id', id)

    } else {
        const { error: e } = await supabase
            .from('post_likes')
            .insert({
                author_id: user.value.id,
                post_id: id
            })
    }
    liked.value = !liked.value

    await count_likes()
}

async function count_likes() {
    const { data: likes, error: likes_error } = await supabase
        .from('post_likes')
        .select('author_id')
        .eq('post_id', id)

    like_count.value = likes.length

    let { e } = await supabase
        .from('posts')
        .update({
            likes: like_count.value
        })
        .eq('id', id)
}

function copy_to_clipboard() {
    navigator.clipboard.writeText('https://rkg-richat.netlify.app/post/' + id)
    alert("Copied the URL for the post! ")
}

await count_likes()
await download_image()
if (user.value) {
    await check_if_liked()
}

loaded.value = true

</script>

<template>
    <div>

        <div v-if="loaded">
            <div class="card mt-5 p-2">
                <NuxtLink :to="'/user/' + post.author_id" class="card-header link-light d-flex ">
                    <div class="w-100 align-items-center d-flex">
                        <nuxt-img height="55" width="55" format="webp" quality="80" :src="avatar_src" alt=""
                            style="object-fit: cover;" class="rounded-circle m-3" sizes="sm:45 md:45 lg:45"
                            onerror="this.onerror=null;this.src='https:/\/cdn-icons-png.flaticon.com/512/149/149071.png';" />
                        <h5>{{ post.users.nickname }}</h5>
                    </div>
                    <div class="flex-shrink-1 p-2">
                        {{ creation_date.toLocaleDateString("en-GB") + ' ' + creation_date.getHours() + ":" +
                            creation_date.getMinutes() }}
                    </div>

                </NuxtLink>

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
                <div class="card-footer d-flex">
                    <div v-if="user" class="w-100 align-items-center d-flex">
                        <nuxt-img v-if="liked" src="heart-fill.svg" height="25" width="25" class="filter-green m-2"
                            quality="100" @click="update_likes" />
                        <nuxt-img v-else src="heart.svg" height="25" width="25" class="filter-green m-2" quality="100"
                            @click="update_likes" />
                        {{ like_count }}
                    </div>
                    <div v-else class="w-100 align-items-center d-flex">
                        <nuxt-img src="heart-fill.svg" height="25" width="25" class="filter-red m-2" quality="100" />
                        {{ like_count }}
                    </div>

                    <nuxt-img src="share-fill.svg" height="25" width="25" class="filter-green m-2 flex-shrink-1 "
                        quality="100" @click="copy_to_clipboard" />
                </div>

            </div>
        </div>

    </div>
</template>

<style>
.filter-green {
    filter: invert(39%) sepia(60%) saturate(533%) hue-rotate(100deg) brightness(94%) contrast(92%);
}

.filter-red {
    filter: invert(29%) sepia(98%) saturate(1550%) hue-rotate(332deg) brightness(88%) contrast(97%);
}
</style>
