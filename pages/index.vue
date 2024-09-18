<script lang="ts" setup>
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'

definePageMeta({
    middleware:'redirect-if-authenticated'
})

const email = ref('')
const password = ref('')
const auth = getAuth()
const authStore = useAuthStore()
const submit = () => {
    signInWithEmailAndPassword(auth,email.value, password.value).then((data)=>{
        authStore.setUser(data.user)
    }).finally(()=>{
        navigateTo('/dashboard')
    })

}
</script>

<template>
    <div class="bg-gradient-to-r h-screen from-cyan-500 to-blue-500 flex items-center justify-center px-5">
        <div class="bg-white rounded p-5 max-w-96 w-full flex flex-col items-center">
            <h2 class="text-center mb-5">Trello Clone</h2>
            <div class="space-y-5 w-full">
                <Input type="email" placeholder="Email" v-model="email" />
                <Input type="password" placeholder="Password" v-model="password" />
                <Button :disabled="!email || !password" class="w-full " variation="primary"
                    @click="submit">Submit</Button>
            </div>
            <!-- <NuxtLink class="mt-5" to="/registration">
                <p class="text-amber-500 underline">Registration</p>
            </NuxtLink> -->
        </div>
    </div>
</template>
