<script lang="ts" setup>
const rootStore = useRootStore()
const sidebarOffset = computed(() => rootStore.isSidebarOpen ? 'ml:ps-60' : 'ml:ps-[68px]');
</script>

<template>
    <Sidebar />

    <div class="flex flex-col flex-1 padding-transition" :class="sidebarOffset">
        <Header />

        <div class="overflow-y-hidden">
            <slot />
        </div>
    </div>
</template>
