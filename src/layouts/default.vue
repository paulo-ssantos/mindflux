<script lang="ts">
import { defineComponent } from "vue";
import AppConfig from "~/components/layouts/default/AppConfig.vue";
import AppFooter from "~/components/layouts/default/AppFooter.vue";
import AppMenu from "~/components/layouts/default/AppMenu.vue";
import AppTopBar from "~/components/layouts/default/AppTopbar.vue";

export default defineComponent({
  components: {
    AppTopBar,
    AppMenu,
    AppConfig,
    AppFooter,
  },
  data() {
    return {
      layoutMode: "static",
      menuActive: false,
      menuClick: false,
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
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
            {
              label: "Recursos Humanos",
              icon: "pi pi-fw pi-users",
              to: "/acessar-processos/RH",
            },
            {
              label: "Tecnologia",
              icon: "pi pi-desktop",
              to: "/acessar-processos/TI",
            },
            {
              label: "Adminstração",
              icon: "pi pi-sitemap",
              to: "/acessar-processos/ADM",
            },
            {
              label: "Comercial",
              icon: "pi pi-fw pi-wallet",
              to: "/acessar-processos/COMERCIAL",
            },
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
      ],
    };
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-static-sidebar-inactive":
            this.staticMenuInactive && this.layoutMode === "static",
          "layout-overlay-sidebar-active":
            this.overlayMenuActive && this.layoutMode === "overlay",
          "layout-mobile-sidebar-active": this.mobileMenuActive,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false,
          "layout-theme-light": this.$appState.theme?.startsWith("saga"),
        },
      ];
    },
    logo() {
      // return (this.$appState.darkTheme) ? '/images/logo-white.svg' : '/images/logo.svg';
      return "/images/logo.png";
    },
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },
  beforeUpdate() {
    if (this.mobileMenuActive) {
      this.addClass(document.body, "body-overflow-hidden");
    } else {
      this.removeClass(document.body, "body-overflow-hidden");
    }
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onMenuToggle(event: Event) {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event: any) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode: string) {
      this.layoutMode = layoutMode;
    },
    addClass(element: Element, className: string) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += ` ${className}`;
      }
    },
    removeClass(element: Element, className: string) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        element.className = element.className.replace(
          new RegExp(`(^|\\b)${className.split(" ").join("|")}(\\b|$)`, "gi"),
          " ",
        );
      }
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static") {
          return !this.staticMenuInactive;
        } else if (this.layoutMode === "overlay") {
          return this.overlayMenuActive;
        }
      }

      return true;
    },
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
