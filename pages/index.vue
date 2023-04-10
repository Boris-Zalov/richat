<script setup>
let loaded = ref(false)

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const { data, error } = await supabase
    .from('posts')
    .select('id')
    .order('created_at', { ascending: false })

loaded.value = true
</script>

<template>
    <div>
        <div v-if="loaded">
            <h1>
                Home page
            </h1>
            <div v-for="post in data" :key="post.id">
                <LazyPost :id="post.id" />
            </div>
        </div>
        <div v-else class="text-center">
            <div class="spinner-border" role="status" style="width: 30rem; height: 30rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>