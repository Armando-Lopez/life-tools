<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import { TRACKING_JIRA_PATH } from '~/constants/firebaseConstants'
import { JIRA_ISSUE_URL_API, JIRA_ISSUE_WORK_LOG_URL_API } from '~/constants/api'

const { createDoc, updateDoc, isLoading } = useFirestore()
const emit = defineEmits(['onCreateJiraTask'])

const formRef = ref(null)
const isModalOpen = ref(false)
const isValidatingIssue = ref(false)
const isInvalidIssue = ref(false)
const model = ref<Task>({
  code: null,
  description: '',
  timeLogs: {}
})

async function validateJiraIssueExists () {
  isValidatingIssue.value = true
  isInvalidIssue.value = false
  const { data } = await useFetch(JIRA_ISSUE_URL_API, {
    server: false,
    // @ts-ignore
    headers: { authorization: useState('jiraAuth').value },
    query: { issueCode: model.value.code }
  })
  if (data.value?.id) {
    await save()
  } else {
    isInvalidIssue.value = true
  }
  isValidatingIssue.value = false
}

async function save () {
  const { data } = await createDoc(TRACKING_JIRA_PATH, model.value)
  if (data) {
    await getJiraIssueWorkLogs(data)
    emit('onCreateJiraTask', data)
    isModalOpen.value = false
  }
}

async function getJiraIssueWorkLogs (saveData: object) {
  const { data } = await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
    // @ts-ignore
    headers: { authorization: useState('jiraAuth').value },
    query: {
      issue: model.value.code
    }
  })
  const timeLogs = {};
  (data.value?.worklogs || []).forEach((log: any) => {
    const id = `j_${log.id}`
    timeLogs[id] = {
      id,
      jiraWorkLogId: id,
      startedAt: log.started,
      timeSpentSeconds: log.timeSpentSeconds
    }
  })
  await updateDoc(saveData.path, { timeLogs })
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
      :is-loading="isLoading || isValidatingIssue"
      @success="validateJiraIssueExists"
      @on-update="isInvalidIssue = false"
    >
      <AppTextField
        label="Código de insidencia JIRA"
        name="code"
        rules="required|max:10"
      />
      <p v-if="isInvalidIssue" class="text-error">
        No se pudo vincular la insidencia <strong>{{ model.code }}</strong> o no existe
      </p>
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
      </button>
    </AppForm>
  </AppModal>
</template>
