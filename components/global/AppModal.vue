<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  eager: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const modal = ref<HTMLDialogElement>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

onMounted(() => {
  document.body.appendChild(modal.value)
})
onBeforeUnmount(() => {
  document.body.removeChild(modal.value)
})

watch(isOpen, (newValue: boolean) => {
  nextTick(() => {
    if (newValue) {
      modal.value?.showModal()
    } else {
      modal.value?.close()
    }
  })
}, { immediate: true })

function toggle () {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <slot name="activator" :toggle="toggle" />
  <dialog ref="modal" class="modal modal-bottom md:modal-middle">
    <div class="modal-box">
      <div class="flex justify-end">
        <button v-if="!persistent" class="btn btn-square btn-sm" @click="toggle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <slot v-if="isOpen || props.eager" />
    </div>
  </dialog>
</template>
