<script setup>
const { id } = defineProps(['id'])

let loaded = ref(false)

const supabase = useSupabaseClient()

const { data: post, error: post_error } = await supabase
    .from('posts')
    .select('title, text, img_url, author_id, users(avatar_url, nickname)')
    .eq('id', id)
    .single()

loaded.value = true

</script>

<template>
    <div>
        <div v-if="loaded">
            <div class="card mt-5 p-2">
                <div class="card-header d-flex align-items-center">
                    <nuxt-img height="45" width="45" format="webp" quality="80" :src="post.users.avatar_url" alt=""
                        style="object-fit: cover;" class="rounded-circle m-3" sizes="sm:45 md:45 lg:45"
                        onerror="this.onerror=null;this.src='https:/\/cdn-icons-png.flaticon.com/512/149/149071.png';" />
                    <h3>{{ post.users.nickname }}</h3>
                </div>
                <div class="text-center">
                    <div class="card-body">
                        <h5 class="card-title">{{ post.title }}</h5>
                        <p class="card-text">{{ post.text }}</p>
                        <nuxt-img v-if="post.img_url" :src="post.img_url" class="img-fluid p-2" alt="" loading="lazy" />
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>