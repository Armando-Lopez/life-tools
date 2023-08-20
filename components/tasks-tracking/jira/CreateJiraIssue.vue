<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import { TRACKING_JIRA_TASKS_PATH } from '~/constants/firebaseConstants'

const { createDoc, isLoading } = useFirestore()
const emit = defineEmits(['onCreateJiraTask'])

const formRef = ref(null)
const isModalOpen = ref(false)
const model = ref<Task>({
  code: null,
  description: '',
  timeLogs: {}
})

async function save () {
  const { data } = await createDoc(TRACKING_JIRA_TASKS_PATH, model.value)
  if (data) {
    emit('onCreateJiraTask', data)
    isModalOpen.value = false
  }
}

watch(isModalOpen, (newValue) => {
  if (!newValue) {
    formRef.value.resetForm()
  }
})
</script>

<template>
  <button
    class="md:hidden fixed bottom-3 right-3 z-10 btn btn-primary"
    @click="isModalOpen = true"
  >
    <AppIcon icon="ic:baseline-create" width="20" class="text-white" />
    Agregar tarea
  </button>
  <button
    class="hidden md:flex btn btn-primary"
    @click="isModalOpen = true"
  >
    <AppIcon icon="ic:baseline-create" width="20" />
    Agregar tarea
  </button>
  <AppModal v-model="isModalOpen">
    <p class="mb-5 font-semibold text-lg">
      Agregar tarea vinculada a JIRA
    </p>
    <AppForm
      ref="formRef"
      v-model="model"
      autocomplete="off"
      :is-loading="isLoading"
      @success="save"
    >
      <AppTextField
        label="Código JIRA"
        name="code"
        rules="required|max:10"
      />
      <AppTextArea
        label="Descripción"
        name="description"
        rules="required"
      />
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
      </button>
    </AppForm>
  </AppModal>
</template>
