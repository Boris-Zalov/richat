<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

let title = ref('')
let text = ref('')
let files = ref()

async function create_post() {
    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: title.value,
            text: text.value,
            author_id: user.value.id
        })
        .select()
        .single()
    try {
        const file = files.value[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${data.id}.${fileExt}`
        const filePath = `${fileName}`

        let { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError
        const { error: updateError } = await supabase
        .from('posts')
        .update({
            img_url: filePath,
        })
        .eq('id', data.id)
    } catch (error) {
        alert(error.message)
    }
    await navigateTo('/')
    if (error) {
        alert(error)
    }

}

async function change_url(evt) {
    files.value = evt.target.files
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
                <label for="picture " class="form-label">Post picture</label>
                <input class="form-control form-control-sm" type="file" accept="image/*" @change="change_url">
            </div>
            <input type="submit" class="btn btn-success" value="Post!">
        </form>
        <Auth v-else />

    </div>
</template>
