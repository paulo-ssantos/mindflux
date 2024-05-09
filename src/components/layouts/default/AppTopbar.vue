<script lang="ts" setup>
import { ref, computed } from 'vue';

// Assuming $appState is available globally or imported
const appState = useNuxtApp().appState;

const visibleRight = ref(false);

const emit = defineEmits(['topbarMenuToggle', 'menuToggle']);

const onMenuToggle = (event: Event) => {
  emit('menuToggle', event);
};

const onTopbarMenuToggle = (event: Event) => {
  emit('topbarMenuToggle', event);
};

const topbarImage = () => {
  // return this.$appState.darkTheme? '/images/logo-white.svg' : '/images/logo-dark.svg';
  return '/images/logo.png';
};

const router = useRouter();
const supabase = useSupabaseClient();

const logout = async () => {
  visibleRight.value = false;

  await supabase.auth.signOut();

  router.push('/login');
};
</script>

<template>
  <div class="layout-topbar">
    <NuxtLink to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage()">
      <span>MINDFLUX</span>
    </NuxtLink>
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <i class="pi pi-bars" />
    </button>

    <button
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true
      }"
      class="p-link layout-topbar-menu-button layout-topbar-button"
    >
      <i class="pi pi-ellipsis-v" />
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <button class="p-link layout-topbar-button">
          <i class="pi pi-calendar" />
          <span>Events</span>
        </button>
      </li>
      <li>
        <button class="p-link layout-topbar-button">
          <i class="pi pi-cog" />
          <span>Settings</span>
        </button>
      </li>
      <li>
        <button class="p-link layout-topbar-button" @click="visibleRight = true">
          <i class="pi pi-user" />
          <span>Profile</span>
        </button>
      </li>
    </ul>
  </div>

  <Sidebar v-model:visible="visibleRight" :base-z-index="1000" position="right">
          <h1 style="fontWeight:normal">
            Right Sidebar
          </h1>
          <Button
            type="button" label="Logout" class="p-button-warning"
            style="margin-right:.25em"
            @click="logout"
          />
          <Button type="button" label="Cancel" class="p-button-secondary" @click="visibleRight = false" />
        </Sidebar>
</template>
