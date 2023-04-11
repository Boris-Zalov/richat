<script setup>
const supabase = useSupabaseClient()

let nickname = ref("")
let email = ref("")
let password = ref("")
let bio = ref("")
let avatar_url = ref()
let files = ref()

let email_valid_state = ref("")
let email_taken = ref(false)
let password_valid_state = ref("")
let nickname_valid_state = ref("")

let btn_enabled = ref(false)

let loading = ref(false)

let registration_completed = ref(false)

async function validate_email() {
    if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.value)) {
        let { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.value)

        if (data.length == 0) {
            email_valid_state.value = "is-valid"
            email_taken.value = false
        } else {
            email_valid_state.value = "is-invalid"
            email_taken.value = true
        }

    } else {
        email_valid_state.value = "is-invalid"
        email_taken.value = false

    }
    button_enabled()
}

function validate_password() {
    if (password.value.length < 6) {
        password_valid_state.value = "is-invalid"
    } else {
        password_valid_state.value = "is-valid"
    }
    button_enabled()
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
    if (email_valid_state.value == "is-valid" && password_valid_state.value == "is-valid" && nickname_valid_state.value == "is-valid") {
        btn_enabled.value = true
    } else {
        btn_enabled.value = false
    }
}


async function create_user() {
    try {
        loading.value = true
        const { data } = await supabase.auth.signUp(
            {
                email: email.value,
                password: password.value,
                options: {
                    data: {
                        nickname: nickname.value,
                        bio: bio.value,
                        avatar_url: avatar_url.value
                    }
                }
            }
        )
        let { error } = await supabase
            .from('users')
            .insert({
                id: data.user.id,
                email: data.user.email,
                created_at: data.user.created_at,
                avatar_url: data.user.user_metadata.avatar_url,
                nickname: data.user.user_metadata.nickname,
                bio: data.user.user_metadata.bio
            })
        if (error) throw error

        try {
            const file = files.value[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${data.user.id}.${fileExt}`
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
                .eq('id', data.user.id)
        } catch (error) {
            alert(error.message)
        }

        registration_completed.value = true
    } catch (error) {
        alert(error.error_description || error.message)
    } finally {
        loading.value = false
    }

}

async function change_url(evt) {
    files.value = evt.target.files
}

watch(email, () => {
    if (email_valid_state.value != "") {
        validate_email()
    }
})

watch(password, () => {
    if (password_valid_state.value != "") {
        validate_password()
    }
})

watch(nickname, () => {
    if (nickname_valid_state.value != "") {
        validate_nickname()
    }
})

</script>

<template>
    <div>
        <form @submit.prevent="create_user">
            <legend>Create a new <b>Richat</b> account</legend>
            <div class="mb-3">
                <label class="form-label">Your nickname</label>
                <input class="form-control" v-model="nickname" :class="nickname_valid_state" @focusout="validate_nickname">
                <div class="form-text">How should others call you (must be at least 3 characters long)</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Email address</label>
                <input for="Email" type="email" class="form-control" :class="email_valid_state" aria-describedby="emailHelp"
                    v-model="email" @focusout="validate_email">
                <div class="form-text">We'll never share your email with anyone else.</div>
                <div class="form-text text-danger" v-if="email_taken">This email adress is already used. If it's your's, try
                    to
                    log in.</div>
            </div>
            <div class="mb-3">
                <label class="form-label">New password</label>
                <input type="password" class="form-control" v-model="password" @focusout="validate_password"
                    :class="password_valid_state">
                <div class="form-text">Must be at least 6 characters long</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Tell about yourself</label>
                <textarea class="form-control" rows="3" v-model="bio"></textarea>
                <div class="form-text">This is optional</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Profile picture</label>
                <input class="form-control form-control-sm" type="file" accept="image/*" @change="change_url">
                <div class="form-text">This is optional</div>
            </div>
            <div v-if="loading">
                <button class="btn btn-success" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Signing up
                </button>
            </div>
            <div v-else class="mb-3">
                <input v-if="btn_enabled" type="submit" class="btn btn-success" value="Sign up">
                <button v-else type="button" class="btn btn-outline-success" disabled>Sign up</button>
            </div>


        </form>

        <div class="alert alert-success alert-dismissible fade show" role="alert" v-if="registration_completed">
            <h4 class="alert-heading">Registration completed successfully!</h4>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <p>Now check your email for the confirmation letter!</p>
            <hr>
            <p class="mb-0">If you didn't receive a letter, try creating an account a bit later.</p>
        </div>
    </div>
</template>