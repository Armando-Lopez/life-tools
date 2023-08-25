<script setup lang="ts">
const props = defineProps({
  contentClass: {
    type: String, default: ''
  }
})
</script>

<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="cursor-pointer">
      <slot name="activator" />
    </label>

    <ul
      tabindex="0"
      class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
      :class="props.contentClass"
    >
      <slot />
    </ul>
  </div>
</template>
