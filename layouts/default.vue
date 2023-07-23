<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
// import { useUserStore } from '~/stores/user'
// const userStore = useUserStore()
</script>

<template>
  <div class="relative min-h-screen flex flex-col">
    <VitePwaManifest />
    <TheHeader />
    <slot />
    <!--    <div class="h-screen w-screen grid place-items-center">-->
    <!--      <AppLoader />-->
    <!--    </div>-->
  </div>
</template>
