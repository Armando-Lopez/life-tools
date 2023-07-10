// https://nuxt.com/docs/api/configuration/nuxt-config
import eslintPlugin from 'vite-plugin-eslint'
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    plugins: [eslintPlugin()]
  },
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      GOOGLE_API_CLIENT_ID: process.env.GOOGLE_API_CLIENT_ID,
      GOOGLE_API_KEY: process.env.GOOGLE_API_CLIENT_ID
    }
  },
  app: {
    head: {
      title: 'Life tools',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      script: [
        { src: 'https://apis.google.com/js/api.js', defer: true, async: true },
        { src: 'https://accounts.google.com/gsi/client', defer: true, async: true }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  components: [
    '~/components/global/'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
