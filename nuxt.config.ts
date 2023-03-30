export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      script: [
        {
          src: '/js/bootstrap.bundle.min.js',
          type: "text/javascript"
        },
        {
          src: '/js/navbar_active.js',
          type: "text/javascript"
        }
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },

  css: ["@/assets/css/bootstrap.min.css"],

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },

  modules: ['@nuxtjs/supabase'],

})
