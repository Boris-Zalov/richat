<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

let title = ref('')
let text = ref('')
let img_url = ref('')

async function create_post() {
    const { error } = await supabase
        .from('posts')
        .insert({ 
            title: title.value, 
            text: text.value,
            img_url: img_url.value,
            author_id: user.value.id 
        })
        await navigateTo('/')
        if (error) {
            alert(error)
        }
}
</script>

<template>
    <div>
        <form v-if="user" @submit.prevent="create_post">
            <legend>Creaate a new post!</legend>
            <div class="mb-3">
                <label for="Title" class="form-label">Post title</label>
                <input type="title" class="form-control" v-model="title" required>
            </div>
            <div class="mb-3">
                <label for="Text" class="form-label">Text</label>
                <textarea class="form-control" v-model="text" rows="4"></textarea>
            </div>
            <div class="mb-3">
                <label for="picture " class="form-label">Post picture URL</label>
                <input type="url" class="form-control" v-model="img_url">
            </div>
            <input type="submit" class="btn btn-success" value="Post!">
        </form>
        <Auth v-else />

    </div>
</template>
