<script lang="ts">
import { useToast } from 'primevue/usetoast';
import { defineComponent, reactive, ref, computed, onBeforeUpdate, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '~/components/layouts/default/AppConfig.vue';
import AppFooter from '~/components/layouts/default/AppFooter.vue';
import AppMenu from '~/components/layouts/default/AppMenu.vue';
import AppTopBar from '~/components/layouts/default/AppTopbar.vue';

export default defineComponent({
  components: {
    AppTopBar,
    AppMenu,
    AppConfig,
    AppFooter,
  },
  async setup() {
    const router = useRouter();

    const layoutMode = ref('overlay');
    const menuActive = ref(false);
    const menuClick = ref(false);
    const staticMenuInactive = ref(false);
    const overlayMenuActive = ref(false);
    const mobileMenuActive = ref(false);

    // Get Categories
    const supabase = useSupabaseClient();

    const categories: any[] = (await supabase.from('categorias').select()).data || [];

    console.log('CATEGORIES = ', categories);

    const menu = reactive([
      {
        label: "Home",
        items: [
          {
            label: "Dashboard",
            icon: "pi pi-fw pi-home",
            to: "/",
          },
        ],
      },
      {
        label: "Gerenciar Processos",
        icon: "pi pi-fw pi-sitemap",
        items: [
          {
            label: "Novo",
            icon: "pi pi-plus",
            to: "/gerenciamento-processos/novo",
          },
          {
            label: "Meus Processos",
            icon: "pi pi-folder",
            to: "/gerenciamento-processos/meus-processos",
          },
          {
            label: "Histórico de Processos",
            icon: "pi pi-folder-open",
            to: "/gerenciamento-processos/historico-processos",
          },
        ],
      },
      {
        label: "Acessar Processos",
        icon: "pi pi-fw pi-sitemap",
        items: [
          {
            label: "Todos os Processos",
            icon: "pi pi-fw pi-folder",
            to: "/acessar-processos",
          },
          // Caminhos dinâmicos para cada categoria
          ...categories.map((categoria) => ({
            label: categoria.nome,
            icon: "pi pi-fw pi-folder",
            to: `/acessar-processos/${categoria.nome.toLowerCase().replace(/ /g, "-")}`,
          })),
        ],
      },
      {
        label: "Gestão",
        icon: "pi pi-fw pi-lock",
        items: [
          {
            label: "Gestão de Usuários",
            icon: "pi pi-fw pi-user-edit",
            to: "/gestao/gestao-usuario",
          },
          {
            label: "Gestão de Processos",
            icon: "pi pi-fw pi-file-edit",
            to: "/gestao/gestao-processo",
          },
          {
            label: "Auditoria",
            icon: "pi pi-fw pi-history",
            to: "/gestao/auditoria",
          },
        ],
      },
      {
        label: "Ajuda e Suporte",
        items: [
          {
            label: "Documentação do Sistema",
            icon: "pi pi-fw pi-question",
            to: "/suporte/documentacao",
          },
          {
            label: "Contatar Suporte",
            icon: "pi pi-envelope",
            to: "/suporte/contatar",
          },
          {
            label: "Sobre",
            icon: "pi pi-fw pi-info-circle",
            to: "/suporte/sobre",
          },
        ],
      },
    ]);

    const containerClass = computed(() => [
      'layout-wrapper',
      {
        'layout-overlay': layoutMode.value === 'overlay',
        'layout-static': layoutMode.value === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive.value && layoutMode.value === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive.value && layoutMode.value === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive.value,
        'p-input-filled': usePrimeVue().config.inputStyle === 'filled',
        'p-ripple-disabled': usePrimeVue().config.ripple === false,
        'layout-theme-light': useNuxtApp().theme?.startsWith('saga'),
      },
    ]);

    const logo = computed(() => '/images/logo.png');

    watch(() => router.currentRoute, () => {
      menuActive.value = false;
      useToast().removeAllGroups();
    });

    onBeforeUpdate(() => {
      if (mobileMenuActive.value) {
        addClass(document.body, 'body-overflow-hidden');
      } else {
        removeClass(document.body, 'body-overflow-hidden');
      }
    });

    const onWrapperClick = () => {
      if (!menuClick.value) {
        overlayMenuActive.value = false;
        mobileMenuActive.value = false;
      }
      menuClick.value = false;
    };

    const onMenuToggle = (event: Event) => {
      menuClick.value = true;

      if (isDesktop()) {
        if (layoutMode.value === 'overlay') {
          if (mobileMenuActive.value) {
            overlayMenuActive.value = true;
          }

          overlayMenuActive.value = !overlayMenuActive.value;
          mobileMenuActive.value = false;
        } else if (layoutMode.value === 'static') {
          staticMenuInactive.value = !staticMenuInactive.value;
        }
      } else {
        mobileMenuActive.value = !mobileMenuActive.value;
      }

      event.preventDefault();
    };

    const onSidebarClick = () => {
      menuClick.value = true;
    };

    const onMenuItemClick = (event: any) => {
      if (event.item && !event.item.items) {
        overlayMenuActive.value = false;
        mobileMenuActive.value = false;
      }
    };

    const onLayoutChange = (newLayoutMode: string) => {
      layoutMode.value = newLayoutMode;
    };

    const addClass = (element: Element, className: string) => {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += ` ${className}`;
      }
    };

    const removeClass = (element: Element, className: string) => {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = element.className.replace(
          new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
          ' ',
        );
      }
    };

    const isDesktop = () => {
      return window.innerWidth >= 992;
    };

    const isSidebarVisible = () => {
      if (isDesktop()) {
        if (layoutMode.value === 'static') {
          return !staticMenuInactive.value;
        } else if (layoutMode.value === 'overlay') {
          return overlayMenuActive.value;
        }
      }
      return true;
    };

    return {
      layoutMode,
      menuActive,
      menuClick,
      staticMenuInactive,
      overlayMenuActive,
      mobileMenuActive,
      menu,
      containerClass,
      logo,
      onWrapperClick,
      onMenuToggle,
      onSidebarClick,
      onMenuItemClick,
      onLayoutChange,
      addClass,
      removeClass,
      isDesktop,
      isSidebarVisible,
    };
  },
});
</script>


<template>
  <div :class="containerClass" @click="onWrapperClick">
    <Toast />
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <slot />
      </div>
      <AppFooter />
    </div>

    <AppConfig :layout-mode="layoutMode" @layout-change="onLayoutChange" />
    <transition name="layout-mask">
      <div v-if="mobileMenuActive" class="layout-mask p-component-overlay" />
    </transition>
  </div>
</template>

<style lang="scss">
@import "~/assets/styles/App.scss";
</style>
