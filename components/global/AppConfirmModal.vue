<script setup lang="ts">
const props = defineProps({
  message: { type: String, required: true },
  onConfirmCallBack: { type: Function, default: () => ({}) }
})
const emit = defineEmits(['onClose'])

function onConfirm (value: boolean) {
  props.onConfirmCallBack(value)
  emit('onClose')
}
</script>

<template>
  <AppModal :model-value="true" persistent>
    <p class="mb-5 text-xl">
      {{ props.message }}
    </p>
    <div class="flex justify-end gap-4">
      <button class="btn btn-primary" @click="onConfirm(true)">
        Aceptar
      </button>
      <button class="btn btn-secondary" @click="onConfirm(false)">
        Cancelar
      </button>
    </div>
  </AppModal>
</template>
