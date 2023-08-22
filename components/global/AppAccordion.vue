<script setup lang="ts">
const emit = defineEmits(['onOpen', 'onClose'])

const isActive = ref(false)

function toggle () {
  isActive.value = !isActive.value
  if (isActive.value) {
    emit('onOpen')
  } else {
    emit('onClose')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center cursor-pointer" tabindex="0" @click="toggle">
      <slot name="header" />
      <AppIcon
        :class="{ 'rotate-180': isActive }"
        class="ml-auto text-info with-transition"
        icon="ic:sharp-expand-more"
        width="30"
      />
    </div>
    <div :class="{ 'is-open mt-2': isActive }" class="wrapper with-transition">
      <div class="inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-rows: 0fr;
}

.wrapper.is-open {
  grid-template-rows: 1fr;
}

.inner {
  overflow: hidden;
}
</style>
