<script setup lang="ts">
import { QuickTimeLogger, Task } from '~/interfaces/tasksTracking'
import { generateId } from '~/helpers'
import { JIRA_QUICK_LOGGER_MODES } from '~/constants/tasksTrackingConstants'

const { isLoading: isCreateLoggerLoading, updateDoc } = useFirestore()

const emit = defineEmits(['onClose', 'onLoggerCreated'])

const jiraIssue = inject<Task>('jiraIssue', {} as Task)
const modal = ref(true)
const model = ref<QuickTimeLogger>({
  duration: '',
  name: '',
  startAt: '',
  mode: ''
})

const loggerModeDescription = computed(() =>
  JIRA_QUICK_LOGGER_MODES.find(item => item.code === model.value.mode)?.description
)

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
      Crear registros rapidos
    </p>
    <p>
      Haz más rápido el registro para horarios repetitivos en esta tarea
    </p>
    <AppForm
      v-model="model"
      autocomplete="off"
      :is-loading="isCreateLoggerLoading"
      @success="addQuickLogger"
    >
      <AppTextField
        label="Nombre"
        name="name"
        rules="required|max:100"
      />
      <AppTextField
        label="Hora de inicio"
        name="startAt"
        type="time"
        rules="required"
        hint="A partir de está hora se ejecutará en los modos Semiautomático y Automático"
      />
      <AppTextField
        label="Duración"
        name="duration"
        :rules="{ required: true, regex: /^\d+[dhm](?:\s+\d+[dhm])*$/ }"
        hint="Usa este formato: 1h 45m"
      />
      <AppSelect
        :items="JIRA_QUICK_LOGGER_MODES"
        item-value="code"
        item-text="name"
        label="Modo de registro"
        name="mode"
        rules="required"
        :hint="loggerModeDescription"
      />
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
        <span v-show="isCreateLoggerLoading" class="loading loading-spinner" />
      </button>
    </AppForm>
  </AppModal>
</template>
