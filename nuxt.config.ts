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
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
    }
  },
  app: {
    head: {
      title: 'Life tools',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss'
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
