<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
</script>

<template>
  <div class="container mx-auto">
    <TheHeader />
    <main>
      <slot />
    </main>
  </div>
</template>
