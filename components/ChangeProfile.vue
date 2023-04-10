<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)

const nickname = ref('')
const avatar_url = ref('')

const btn_enabled = ref(true)

loading.value = true
const user = useSupabaseUser()

let { data } = await supabase
    .from('users')
    .select(`nickname, avatar_url`)
    .eq('id', user.value.id)
    .single()

if (data) {
    nickname.value = data.nickname
    avatar_url.value = data.avatar_url
}

loading.value = false

async function update_profile() {
    try {
        loading.value = true
        const user = useSupabaseUser()

        const updates = {
            nickname: nickname.value,
            avatar_url: avatar_url.value,
        }

        let { error } = await supabase.from('users').update(updates, {
            returning: 'minimal',
        }).eq('id', user.value.id)

        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
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
                    <label class="form-label" for="nickname">Name</label>
                    <input class="form-control" id="nickname" type="text" v-model="nickname" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="website">Avatar URL</label>
                    <input class="form-control" id="website" type="website" v-model="avatar_url" />
                </div>

                <div v-if="loading">
                    <button class="btn btn-success" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Signing up
                    </button>
                </div>
                <div v-else class="mb-3">
                    <input v-if="btn_enabled" @click="update_profile" type="submit" class="btn btn-success" value="Update">
                </div>
            </form>
    </div>
</template>
