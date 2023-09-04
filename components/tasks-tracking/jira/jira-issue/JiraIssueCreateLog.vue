<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import { emit as eventEmit } from '~/helpers/eventBus'

import { JIRA_TIMESTAMP_FORMAT } from '~/constants/tasksTrackingConstants'

const { isLoading, createJiraIssueWorkLog } = useJiraIssue()
const { now, textTimeToSeconds } = useTime()

const emit = defineEmits(['onClose'])

const modal = ref(true)
const jiraIssue = inject<Task>('jiraIssue', {} as Task)
const model = ref({
  date: '',
  time: '',
  duration: ''
})

async function addLog () {
  const startAt = now(`${model.value.date} ${model.value.time}`).format(JIRA_TIMESTAMP_FORMAT)
  const timeSpentSeconds = textTimeToSeconds(model.value.duration)
  const { error } = await createJiraIssueWorkLog({
    issueCode: jiraIssue.code,
    startAt,
    timeSpentSeconds
  })
  if (error) {
    eventEmit('toast:open', {
      type: 'ERROR',
      title: jiraIssue.code,
      message: 'No se puso registrar el tiempo en JIRA'
    })
  } else {
    eventEmit('toast:open', {
      type: 'SUCCESS',
      title: jiraIssue.code,
      message: 'Tiempo registrado en JIRA'
    })
    emit('onClose')
  }
}
</script>

<template>
  <AppModal v-model="modal" @update:model-value="!$event && emit('onClose')">
    <p class="mb-4 text-xl font-bold">
      Registrar tiempo
    </p>
    <AppForm
      v-model="model"
      autocomplete="off"
      :is-loading="isLoading"
      @success="addLog"
    >
      <AppTextField
        label="Fecha"
        name="date"
        type="date"
        rules="required"
      />
      <AppTextField
        label="Hora de inicio"
        name="time"
        type="time"
        rules="required"
      />
      <AppTextField
        label="Duración"
        name="duration"
        :rules="{ required: true, regex: /^\d+[dhm](?:\s+\d+[dhm])*$/ }"
        hint="Usa este formato: 1h 45m"
        hint-top
      />
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
        <span v-show="isLoading" class="loading loading-spinner" />
      </button>
    </AppForm>
  </AppModal>
</template>
