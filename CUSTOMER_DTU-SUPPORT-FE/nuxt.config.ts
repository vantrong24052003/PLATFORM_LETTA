// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/i18n', '@vee-validate/nuxt', '@pinia/nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  components: [{ path: 'app/components', pathPrefix: false }],
  vite: {
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: false,
    },
  },
  tailwindcss: {
    config: {
      future: {
        hoverOnlyWhenSupported: true,
      },
    },
  },
  i18n: {
    langDir: '../i18n/locales',
    locales: [
      {
        code: 'en',
        name: 'English',
        files: ['common/en.yml', 'home/en.yml', 'tools/en.yml', 'gpa/en.yml', 'chat/en.yml', 'marketplace/en.yml'],
        iso: 'en-US',
      },
      {
        code: 'vi',
        name: 'Vietnamese',
        files: ['common/vi.yml', 'home/vi.yml', 'tools/vi.yml', 'gpa/vi.yml', 'chat/vi.yml', 'marketplace/vi.yml'],
        iso: 'vi-VN',
      },
      {
        code: 'ja',
        name: 'Japanese',
        files: ['common/ja.yml', 'home/ja.yml', 'tools/ja.yml', 'gpa/ja.yml', 'chat/ja.yml', 'marketplace/ja.yml'],
        iso: 'ja-JP',
      },
    ],
    defaultLocale: 'en',
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
    },
  },
})
