<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
</script>

<template>
  <div v-if="userStore.hasLoadedAuth" class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow container mx-auto">
      <slot />
    </main>
  </div>
</template>
