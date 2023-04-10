<script setup>
const { id } = defineProps(['id'])

let loaded = ref(false)

const supabase = useSupabaseClient()

const { data, error } = await supabase
    .from('posts')
    .select('title, text, img_url')
    .eq('id', id)
    .single()

loaded.value = true

</script>

<template>
    <div class="card mt-5 p-2 text-center">

        <div class="card-body">
            <h5 class="card-title">{{ data.title }}</h5>
            <p class="card-text">{{ data.text }}</p>
            <img :src="data.img_url" class="card-img-top img-fluid" style="width: min-content;" alt="">
        </div>

        

    </div>
</template>