<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()

onBeforeMount(() => {
  document.documentElement.setAttribute(
    'data-theme',
    localStorage.getItem('toutils-theme') || 'light'
  )
})
</script>

<template>
  <div class="pb-10">
    <VitePwaManifest />
    <div v-if="userStore.hasLoadedAuth" class="relative min-h-screen flex flex-col">
      <TheHeader />
      <slot />
      <AppToast />
    </div>
    <div v-else class="fixed top-0 left-0 z-50 h-screen w-screen grid place-items-center bg-base-100">
      <AppLoader />
    </div>
  </div>
</template>
