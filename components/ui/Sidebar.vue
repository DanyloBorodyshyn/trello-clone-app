<script lang="ts" setup>
import { getAuth, signOut } from 'firebase/auth';
import {LogOut, ArrowRight, ArrowLeft, AlignHorizontalJustifyStart, X} from 'lucide-vue-next'
const rootStore = useRootStore();
const sections = SidebarSections;
const isSidebarOpen = computed(() => rootStore.isSidebarOpen);
const toggleSidebar = () => {
    rootStore.toggleSidebar();
};
const toggleMobileSideBar = () => {
    if (window.outerWidth < 975) toggleSidebar()
};
const authStore = useAuthStore()
const logout = async () => {
    if(isSidebarOpen.value) rootStore.toggleSidebar();
    const auth = getAuth()
    await signOut(auth)
    authStore.$reset()
    navigateTo('/')
}
</script>

<template>
    <div class="sidebar-container" :class="{ 'sidebar-open': isSidebarOpen }">
        <div class="fixed z-50 h-full max-h-[100vh]">
            <div :class="{ 'sidebar-open': isSidebarOpen }"
                class="h-full min-h-[100vh] w-[68px] bg-black sidebar-container text-white relative">
                <button
                    class="absolute right-[-0.875rem] ml:flex bg-white w-7 h-7 rounded-2xl border border-[#E6E1DA] top-[59px] flex items-center justify-center"
                    @click="toggleSidebar">
                    <ArrowRight color="#000" :size="24" v-if="!isSidebarOpen" />
                    <ArrowLeft color="#000" :size="24" v-else />
                </button>
                <div class="flex items-center justify-center pt-5">
                    <AlignHorizontalJustifyStart :size="24"/>
                </div>
                <div class="flex pt-5 items-center justify-between border-[#58595E] border-b ml:border-b-0 px-6 pb-6 mb-5 ml:mb-0 ml:pb-10">
                </div>
                <NuxtLink @click="toggleMobileSideBar" :to="section.path" v-for="section in sections"
                    exact-active-class="sidenav-acitve-link"
                    class="w-full cursor-pointer">
                    <div :class="{ 'py-0': !isSidebarOpen, 'py-3.5': isSidebarOpen, ' px-0': !isSidebarOpen, ' px-6': isSidebarOpen, 'pl-6': !isSidebarOpen }"
                        class="text-white min-h-14 flex mr-2 rounded-r-sm items-center">
                        <img class="mr-2 min-h-5 min-w-5 sidenav-link-icon" :src="section.ico" alt="icon">
                        <span v-if="isSidebarOpen" class="text-base font-normal sidenav-link-text text-ellipsis whitespace-nowrap"
                            :class="{ 'animate-fade-in': isSidebarOpen }">
                            {{section.title}}
                        </span>
                    </div>
                </NuxtLink>
                <div @click="logout" :class="{ 'py-0': !isSidebarOpen, 'py-3.5': isSidebarOpen, ' px-0': !isSidebarOpen, ' px-6': isSidebarOpen, 'pl-6': !isSidebarOpen }" class=" text-white min-h-14 flex mr-2 rounded-r-sm items-center cursor-pointer">
                    <LogOut class="mr-2" />
                    <p v-if="isSidebarOpen" :class="{ 'animate-fade-in': isSidebarOpen }" class="text-base font-normal sidenav-link-text">Logout</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fade-in 0.5s ease forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>