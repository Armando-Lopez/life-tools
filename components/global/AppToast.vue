<script setup lang="ts">
import { subscribe } from '~/helpers/eventBus'
const colors = { ERROR: 'alert-error', INFO: 'alert-info', SUCCESS: 'alert-success' }
const icons = { ERROR: 'mdi:alert-circle', INFO: 'mdi:information', SUCCESS: 'mdi:check-circle' }

interface Toast {
  type: string
  title: 'SUCCESS' | 'ERROR' | 'INFO'
  message: string
  timeout: number
}

const toastQueue = ref<Toast[]>([])

onMounted(() => {
  subscribe('toast:open', (data: Toast) => {
    toastQueue.value.push(data)
    setTimeout(() => {
      toastQueue.value.shift()
    }, data.timeout || 5000)
  })
})
</script>

<template>
  <div class="toast z-50">
    <TransitionGroup name="toast">
      <div v-for="(toast, i) in toastQueue" :key="i" class="alert shadow-md" :class="colors[toast.type]">
        <div class="flex items-center gap-2">
          <AppIcon :icon="icons[toast.type]" width="30" />
          <div class="text-left">
            <strong>{{ toast.title }}</strong>
            <p>{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-leave-active {
  @apply transition-all duration-300 ease-in
}
.toast-enter-active {
  @apply transition-all duration-500 ease-out
}
.toast-enter-from {
  @apply translate-x-full opacity-0
}
.toast-leave-to {
  @apply -translate-y-full opacity-0
}
</style>
