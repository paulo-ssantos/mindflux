import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { 'http-equiv': 'x-ua-compatible', 'content': 'IE=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' }
      ]
    }
  },

  build: {
    transpile: [
      'chart.js',
      'primevue'
    ]
  },

  components: {
    dirs: [
      {
        extensions: ['vue'],
        global: true,
        path: '~/components/common/',
        pathPrefix: false
      }
    ]
  },

  css: [
    'primevue/resources/primevue.css',
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    'prismjs/themes/prism-coy.css',
    '~/assets/styles/layout.scss',
    '~/assets/demo/flags/flags.css'
  ],

  dir: {
    public: '../public/'
  },

  experimental: {
    asyncContext: true,
    headNext: true,
    typedPages: true,
    typescriptBundlerResolution: true
  },

  Nuxt3EditorJS: {
    EditorJsConfig:
    {
      placeholder: 'Comece a descrever seu processo...',
    }
  },

  // @ts-ignore
  googleFonts: {
    families: {
      Inter: true
    }
  },

  imports: {
    autoImport: true,
    addons: {
      vueTemplate: true
    }
  },

  modules: [
    'nuxt-icon',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/google-fonts',
    '~/modules/primevue',
    '@nuxtjs/supabase',
    "nuxt3-editorjs"
  ],

  supabase: {
    redirectOptions: {
      login: '/login'
    }
  },

  nitro: {
    experimental: {
      asyncContext: true
    },

    future: {
      nativeSWR: true
    }
  },

  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },

  srcDir: 'src/',

  typescript: {
    shim: false
  },

  vite: {
    optimizeDeps: {
      include: [
        '@editorjs/editorjs',
        '@editorjs/header',
        '@editorjs/image',
        '@editorjs/checklist',
        '@editorjs/link',
        '@editorjs/raw',
        '@editorjs/embed',
        '@editorjs/quote',
        '@editorjs/nested-list',
        '@editorjs/paragraph',
        '@editorjs/table',
        '@editorjs/attaches',
        '@editorjs/delimiter',
        '@editorjs/marker',
        'editorjs-change-case',
        'editorjs-hyperlink',
        '@editorjs/text-variant-tune',
        '@editorjs/code',
        '@editorjs/personality',
        '@editorjs/warning',
        '@editorjs/inline-code',
        'editorjs-text-color-plugin',
        'editorjs-undo',
        'editorjs-drag-drop',
        '@calumk/editorjs-columns',
        'editorjs-text-alignment-blocktune',
        '@canburaks/text-align-editorjs',
        'editorjs-html'
      ]
    },
    build: {
      sourcemap: false
    },
    clearScreen: true,
    logLevel: 'info'
  },

  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  }
});
