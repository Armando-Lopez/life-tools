<script setup lang="ts">
// const props = defineProps({})
</script>

<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="cursor-pointer">
      <slot name="activator" />
    </label>

    <div tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
      <slot />
    </div>
  </div>
</template>
