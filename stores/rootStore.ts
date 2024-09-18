import { defineStore } from "pinia";

export const useRootStore = defineStore({
    id: 'rootStore',
    state: ()=>({
        isSidebarOpen: false
    }),
    actions: {
        toggleSidebar(){
            this.isSidebarOpen = !this.isSidebarOpen
        }
    }
})