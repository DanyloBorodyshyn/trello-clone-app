// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/scss/main.scss"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    'nuxt-vuefire',
  ],
  ssr: false,
  vuefire:{
    config: {
      apiKey: "AIzaSyBzpaZliqae-O0pwB9nwlyK1ZBmN7AENLg",
      authDomain: "trello-clone-app-841d7.firebaseapp.com",
      projectId: "trello-clone-app-841d7",
      storageBucket: "trello-clone-app-841d7.appspot.com",
      messagingSenderId: "838009322179",
      appId: "1:838009322179:web:be85f6202e67cf607e8076",
    },
    auth: {
      enabled: true
    },
  },
  shadcn: {
    componentDir: "./components/shadcn-ui",
  },
});