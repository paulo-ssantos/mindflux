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

  // @ts-ignore
  Nuxt3EditorJS: {
    EditorJsConfig: {
      autofocus: true,
      defaultBlock: 'paragraph',
      placeholder: 'Comece a descrever seu processo...',
      minHeight: 300,
      logLevel: 'ERROR',
      i18n: undefined,
      inlineToolbar: ['bold', 'italic', 'underline'],
      tunes: ['textVariant', 'alligment']
    },
    EditorJsToolsConfig: {
      HeaderConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {}
      },
      NestedListConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          nestedlist: {
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          }
        }
      },
      ImageConfig: {
        isEnabled: false,
        supportInColumn: false,
      },
      ChecklistConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          checklist: {
            inlineToolbar: true
          }
        }
      },
      LinkToolConfig: {
        isEnabled: true,
        supportInColumn: true,
      },
      RawConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {}
      },
      EmbedConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {}
      },
      QuoteConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          quote: {
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: "Quote's author"
            }
          }
        }
      },
      ParagraphConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          paragraph: {
            inlineToolbar: true
          }
        }
      },
      TableConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          table: {
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
            }
          }
        }
      },
      AttachesConfig: {
        isEnabled: false,
        supportInColumn: false,
      },
      DelimiterConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {}
      },
      MarkerConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          Marker: {
            shortcut: 'CMD+SHIFT+M'
          }
        }
      },
      ColorConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          Color: {
            config: {
              colorCollections: [
                '#EC7878',
                '#9C27B0',
                '#673AB7',
                '#3F51B5',
                '#0070FF',
                '#03A9F4',
                '#00BCD4',
                '#4CAF50',
                '#8BC34A',
                '#CDDC39',
                '#FFF'
              ],
              defaultColor: '#FF1300',
              type: 'text',
              customPicker: true
            }
          }
        }
      },
      ChangeCaseConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          changeCase: {
            config: {
              showLocaleOption: true,
              locale: 'tr'
            }
          }
        }
      },
      HyperlinkConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          hyperlink: {
            config: {
              shortcut: 'CMD+L',
              target: '_blank',
              rel: 'nofollow',
              availableTargets: ['_blank', '_self'],
              availableRels: ['author', 'noreferrer'],
              validate: false
            }
          }
        }
      },
      TextVariantConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {}
      },
      CodeConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {}
      },
      PersonalityConfig: { // Dont allow read-only mode
        isEnabled: false,
        supportInColumn: false,
      },
      WarningConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          warning: {
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message'
            }
          }
        }
      },
      InlineCodeConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          inlineCode: {
            shortcut: 'CMD+SHIFT+M'
          }
        }
      },
      UndoConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          undo: 'CMD+X',
          redo: 'CMD+ALT+C'
        }
      },
      DragDropConfig: {
        isEnabled: true,
        supportInColumn: true
      },
      ColumnsConfig: {
        isEnabled: true,
        supportInColumn: true
      },
      AlignmentTuneToolConfig: {
        isEnabled: true,
        supportInColumn: true,
        toolsConfig: {
          alligment: {
            config: {
              default: 'left'
            }
          }
        }
      },
      TextAlignConfig: {
        isEnabled: true,
        supportInColumn: true
      }
    },
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
