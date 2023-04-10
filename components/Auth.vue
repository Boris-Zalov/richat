<script setup>
const supabase = useSupabaseClient()

const route = useRoute()

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({ email: email.value })
        if (error) throw error
        alert('Check your email for the login link!')
    } catch (error) {
        alert(error.error_description || error.message)
    } finally {
        loading.value = false
    }
}

async function log_in() {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (error) throw error
        if (route.name == "sign-in") {
            await navigateTo('/')
        }
    } catch (error) {
        alert(error.error_description || error.message)
    }
}

async function log_in_otp() {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({ email: email.value })
        if (error) throw error
        alert('Check your email for the login link!')
    } catch (error) {
        alert(error.error_description || error.message)
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <div>
        <form @submit.prevent="log_in">
            <legend>Log into your <b>Richat</b> account</legend>
            <div class="mb-3">
                <label class="form-label">Email address</label>
                <input for="Email" type="email" class="form-control" aria-describedby="emailHelp" v-model="email">
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password">
            </div>
            <div v-if="loading">
                <button class="btn btn-success" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Signing up
                </button>
            </div>
            <div v-else class="mb-3 btn-group">
                <input @click="log_in" type="submit" class="btn btn-success" value="Sign in"/>
                <button @click="log_in_otp" type="button" class="btn btn-success">Sign in using <i>One Time
                        Password</i></button>
            </div>
        </form>
    </div>
</template>   