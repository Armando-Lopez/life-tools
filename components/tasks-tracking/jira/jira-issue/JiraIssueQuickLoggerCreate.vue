<script setup lang="ts">
import { QuickTimeLogger, Task } from '~/interfaces/tasksTracking'
import { generateId } from '~/helpers'

const { isLoading: isCreateLoggerLoading, updateDoc } = useFirestore()

const emit = defineEmits(['onClose', 'onLoggerCreated'])

const jiraIssue = inject<Task>('jiraIssue', {} as Task)
const modal = ref(true)
const model = ref<QuickTimeLogger>({
  duration: '',
  name: '',
  startAt: '',
  mode: 'AUT'
})

async function addQuickLogger () {
  const id = generateId()
  const logger = {
    ...model.value,
    id
  }
  const { data } = await updateDoc(jiraIssue.path, {
    [`quickLoggers.${id}`]: logger
  })
  if (data) {
    emit('onLoggerCreated', logger)
  }
}
</script>

<template>
  <AppModal v-model="modal" @update:model-value="!$event && emit('onClose')">
    <p class="mb-4 text-xl font-bold">
      Crear registro programado
    </p>
    <p class="mb-4">
      Programa registros de tiempo con hora y duración determinada.
      <br>
      Sólo se ejecutará mientras estés en la applicación.
    </p>
    <AppForm
      v-model="model"
      autocomplete="off"
      :is-loading="isCreateLoggerLoading"
      @success="addQuickLogger"
    >
      <AppTextField
        label="Hora de inicio"
        name="startAt"
        type="time"
        rules="required"
        hint="A partir de está hora se ejecutará en registro automático"
        hint-top
      />
      <AppTextField
        label="Duración"
        name="duration"
        :rules="{ required: true, regex: /^\d+[hm](?:\s+\d+[hm])*$/ }"
        hint="Usa este formato: 1h 45m"
        hint-top
      />
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
        <span v-show="isCreateLoggerLoading" class="loading loading-spinner" />
      </button>
    </AppForm>
  </AppModal>
</template>
