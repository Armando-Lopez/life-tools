<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import { TRACKING_JIRA_PATH } from '~/constants/firebaseConstants'
import { JIRA_ISSUE_URL_API } from '~/constants/api'

const { createDoc } = useFirestore()
const emit = defineEmits(['onCreateJiraIssue'])

const formRef = ref(null)
const isModalOpen = ref(false)
const isLoading = ref(false)
const isInvalidIssue = ref(false)
const model = ref<Task>({
  code: null,
  description: '',
  isPinned: false,
  timeLogs: {}
})

async function handleIssueCreation () {
  try {
    isLoading.value = true
    const issueFromJira = await getIssueDataFromJira()
    if (issueFromJira) {
      await saveIssueTracker(issueFromJira)
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

async function getIssueDataFromJira () {
  isInvalidIssue.value = false
  const { data } = await useFetch(JIRA_ISSUE_URL_API, {
    server: false,
    // @ts-ignore
    headers: { authorization: useState('jiraAuth').value },
    query: { issueCode: model.value.code }
  })
  if (data.value) {
    return data.value
  } else {
    isInvalidIssue.value = true
    return null
  }
}

async function saveIssueTracker (issueData: Object) {
  const { data } = await createDoc(TRACKING_JIRA_PATH, model.value)
  if (data) {
    emit('onCreateJiraIssue', {
      ...data,
      meta: issueData
    })
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
      @success="handleIssueCreation"
      @on-update="isInvalidIssue = false"
    >
      <AppTextField
        label="Código de insidencia JIRA"
        name="code"
        rules="required"
      />
      <AppTextField
        label="Description"
        name="description"
        rules="required|max:200"
      />
      <span v-if="isInvalidIssue" class="text-error">
        No se pudo vincular la insidencia <strong>{{ model.code }}</strong> o no existe
      </span>
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
        <span v-show="isLoading" class="loading loading-spinner" />
      </button>
    </AppForm>
  </AppModal>
</template>
