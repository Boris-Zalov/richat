<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

let uploading = ref(false)
let files = ref()

async function upload_avatar(evt) {
    uploading.value = true
    files.value = evt.target.files
    try {
        uploading.value = false

        if (!files.value || files.value.length === 0) {
            throw new Error('You must select an image to upload.')
        }

        const file = files.value[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.value.id}.${fileExt}`
        const filePath = `avatars/${fileName}`

        let { data } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', user.value.id)

        console.log(data)
        let { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([data.avatar_url])

        let { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        let { error } = await supabase
            .from('users')
            .update({ avatar_url: filePath }, {
                returning: 'minimal',
            })
            .eq('id', user.value.id)
    } catch (error) {
        alert(error.message)
    } finally {
        uploading.value = false
    }

}
</script>

<template>
    <div>
        <div class="mb-3" v-if="user">
            <label for="formFileSm" class="form-label">Small file input example</label>
            <input class="form-control form-control-sm" id="formFileSm" type="file" accept="image/*" @change="upload_avatar"
                :disabled="uploading">
        </div>
        <Auth v-else />
    </div>
</template>