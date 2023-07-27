<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
</script>

<template>
  <div>
    <VitePwaManifest />
    <div v-if="userStore.hasLoadedAuth" class="relative min-h-screen flex flex-col">
      <TheHeader />
      <slot />
    </div>
    <div v-else class="h-screen w-screen grid place-items-center">
      <AppLoader />
    </div>
  </div>
</template>
