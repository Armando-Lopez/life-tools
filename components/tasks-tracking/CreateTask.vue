<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import { useTasksTrackingStore } from '~/stores/tasksTraking'
const tasksStore = useTasksTrackingStore()

const formRef = ref(null)
const isModalOpen = ref(false)
const isSaving = ref(false)
const model = ref<Task>({
  name: '',
  meta: {
    code: null
  },
  description: '',
  trackingSeconds: 0,
  workLogs: {}
})

async function saveTask () {
  isSaving.value = true
  const hasSave = await tasksStore.createTask(model.value)
  isSaving.value = false
  if (hasSave) {
    isModalOpen.value = false
  }
  tasksStore.getTasks()
}

watch(isModalOpen, (newValue) => {
  if (!newValue) {
    formRef.value.resetForm()
  }
})
</script>

<template>
  <button class="fixed bottom-3 right-3 z-10 btn btn-success btn-circle" @click="isModalOpen = true">
    <AppIcon icon="ic:round-plus" width="40px" class="text-white" />
  </button>
  <AppModal v-model="isModalOpen">
    <AppForm
      ref="formRef"
      v-model="model"
      autocomplete="off"
      :is-loading="isSaving"
      @success="saveTask"
    >
      <p class="mb-5 font-semibold text-center text-2xl">
        Agregar tarea
      </p>
      <AppTextField
        label="Nombre"
        name="name"
        rules="required|max:100"
      />
      <AppTextField
        label="Código"
        name="meta.code"
        rules="required|max:10"
      />
      <AppTextArea
        label="Descripción"
        name="description"
        rules="max:300"
      />
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
      </button>
    </AppForm>
  </AppModal>
</template>
