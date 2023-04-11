<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
let loaded = ref(false)

const nickname = ref('')
const files = ref('')

let nickname_valid_state = ref("")

const btn_enabled = ref(true)

loading.value = true
const user = useSupabaseUser()

let { data } = await supabase
    .from('users')
    .select(`nickname`)
    .eq('id', user.value.id)
    .single()

if (data) {
    nickname.value = data.nickname
}

loading.value = false

async function update_profile() {
    try {
        loading.value = true
        const user = useSupabaseUser()

        try {
            if (files.value) {
                const file = files.value[0]
                const fileExt = file.name.split('.').pop()
                const fileName = `${user.value.id}.${fileExt}`
                const filePath = `${fileName}`

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
            }
        } catch (uploadError) {
            alert(uploadError.message)
        }
        const updates = {
            nickname: nickname.value,
        }

        let { error } = await supabase
            .from('users')
            .update(updates, {
                returning: 'minimal',
            })
            .eq('id', user.value.id)

        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
        window.location.reload(true)
    }
}

async function change_url(evt) {
    files.value = evt.target.files
}

function validate_nickname() {
    if (nickname.value.length < 3) {
        nickname_valid_state.value = "is-invalid"
    } else {
        nickname_valid_state.value = "is-valid"
    }
    button_enabled()
}

function button_enabled() {
    if (nickname_valid_state.value == "is-valid") {
        btn_enabled.value = true
    } else {
        btn_enabled.value = false
    }
}

watch(nickname, () => {
    if (nickname_valid_state.value != "") {
        validate_nickname()
    }
})


const { data: posts, error } = await supabase
    .from('posts')
    .select('id')
    .eq('author_id', user.value.id)
    .order('created_at', { ascending: false })

loaded.value = true
</script>

<template>
    <div>
        <form class="form-widget" @submit.prevent="update_profile">
            <legend>Your profile</legend>
            <div class="mb-3">
                <label class="form-label" for="email">Email</label>
                <input class="form-control" id="email" type="text" :value="user.email" disabled />
            </div>
            <div class="mb-3">
                <label class="form-label" for="nickname">Nickname</label>
                <input class="form-control" id="nickname" type="text" v-model="nickname" :class="nickname_valid_state"
                    @focusout="validate_nickname" />
            </div>
            <div class="mb-3">
                <label class="form-label" for="website">Profile picture</label>
                <input class="form-control form-control-sm" type="file" accept="image/*" @change="change_url">
            </div>

            <div v-if="loading">
                <button class="btn btn-success" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Updating
                </button>
            </div>
            <div v-else class="mb-3">
                <input v-if="btn_enabled" type="submit" class="btn btn-success" value="Update">
                <input v-else type="submit" class="btn btn-outline-success" value="Update" disabled>
            </div>
        </form>

        <div>
            <div v-if="loaded">
                <h1>
                    Your posts
                </h1>
                <div v-for="post in posts" :key="post.id">
                    <LazyPost :id="post.id" />
                </div>
            </div>
            <div v-else class="text-center">
                <div class="spinner-border" role="status" style="width: 30rem; height: 30rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>
