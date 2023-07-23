// https://nuxt.com/docs/api/configuration/nuxt-config
import eslintPlugin from 'vite-plugin-eslint'
export default defineNuxtConfig({
  devtools: { enabled: true },
  // @ts-ignore
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
      title: 'Toutils',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'Toutils provee un  conjunto de herramientas para la vida cotidiana' },
        { name: 'keywords', content: 'herramientas, vida, ayuda, finanzas, productividad, economia, tareas' },
        { name: 'robots', content: 'index,follow' }
      ],
      script: [
        // { src: 'https://apis.google.com/js/api.js', defer: true, async: true },
        // { src: 'https://accounts.google.com/gsi/client', defer: true, async: true }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/web-vitals',
    '@vite-pwa/nuxt'
  ],
  components: [
    '~/components/global/'
  ],
  i18n: {
    vueI18n: './i18n.config.ts'
  },
  pwa: {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    manifest: {
      name: 'Toutils',
      short_name: 'Toutils',
      description: 'Herramientas estilo de vida',
      icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone'
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },
  webVitals: {
    // provider: 'log',
    debug: true, // debug enable metrics reporting on dev environments
    disabled: false
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
