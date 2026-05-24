export default defineNuxtConfig({
  ssr: true,
  typescript: {
    strict: true,
    typeCheck: false,
  },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    configPath: './tailwind.config.ts',
    cssPath: '~/assets/css/tailwind.css',
    viewer: false,
  },
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },
  vite: {
    server: {
      middlewareMode: true,
    },
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          rel: 'stylesheet',
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
          rel: 'stylesheet',
        },
      ],
    },
  },
})
