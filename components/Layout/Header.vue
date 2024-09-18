<script lang="ts" setup>
import {User, Menu} from 'lucide-vue-next'
const authStore = useAuthStore()
const rootStore = useRootStore()
const tableStore = useTableStore()
const user = computed(()=>authStore.user)
const boardTitle = computed(()=>tableStore.boardTitle)
const toggleSidebar = () => {
    rootStore.toggleSidebar()
}
</script>

<template>
    <div class="sticky top-0 z-40">
        <div class="border-b border-[#E6E1DA] bg-white relative">
            <div class="flex items-center justify-between sm:px-11 px-5 py-4 max-w-[1440px] mx-auto">
                <div class="flex">
                    <button @click="toggleSidebar" class="mr-2.5 min-[975px]:hidden">
                        <Menu />
                    </button>
                    <p class="min-[366px]:text-2xl font-ramillas text-black max-[365px]:text-xl xs:text-base">{{boardTitle}}
                    </p>
                </div>
                <div class="flex items-center space-x-5">
                    <User :size="30" />
                    <div class="flex flex-col">
                    <p>Signed in as</p>
                    <p>{{ user?.displayName }}</p>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
