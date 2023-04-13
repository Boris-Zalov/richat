<script setup>
let loaded = ref(false)

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const sort = ref('created_at')
const sort_display = ref('relevance')

const posts = ref([])

async function fetch_posts() {
    const { data, error } = await supabase
        .from('posts')
        .select('id')
        .order(sort.value, { ascending: false })

    posts.value = data
}

function order_by_likes() {
    sort.value = 'likes'
    sort_display.value = 'likes'
}

function order_by_created_at() {
    sort.value = 'created_at'
    sort_display.value = 'relevance'
}

watch(sort, async () => {
    await fetch_posts()
})
await fetch_posts()

loaded.value = true
</script>

<template>
    <div>
        <div v-if="loaded">
            <div class="m-2 d-flex align-items-center">
                <h3>
                    Order posts by
                </h3>
                <div class="dropdown p-2">
                    <button class="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ sort_display }}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" @click="order_by_likes"> likes </a></li>
                        <li><a class="dropdown-item" @click="order_by_created_at"> relevance </a></li>
                    </ul>
                </div>
            </div>

            <div v-for="post in posts" :key="post.id">
                <LazyPost :id="post.id" :full="false" />
            </div>
        </div>
        <div v-else class="text-center">
            <div class="spinner-border" role="status" style="width: 30rem; height: 30rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>