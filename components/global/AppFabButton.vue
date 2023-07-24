<script setup lang="ts">
// const items = ref<HTMLDivElement>()
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

function toggle () {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="z-10 fixed bottom-[4.5rem] right-3">
    <div class="overflow-hidden relative flex flex-col-reverse gap-3" role="group">
      <button class="btn btn-primary btn-circle shadow" title="Opciones" @click="toggle">
        <AppIcon icon="ic:round-plus" width="30px" class="text-white" />
      </button>
      <slot v-if="isOpen" />
    </div>
  </div>
</template>
