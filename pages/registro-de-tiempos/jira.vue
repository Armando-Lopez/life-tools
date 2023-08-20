<script setup lang="ts">
import { orderBy, where } from 'firebase/firestore'
import { Task } from '~/interfaces/tasksTracking'
import { APPS_INTEGRATIONS_PATH, TRACKING_JIRA_TASKS_PATH } from '~/constants/firebaseConstants'
import JiraIssueCard from '~/components/tasks-tracking/jira/JiraIssueCard.vue'
import RequestJiraAuth from '~/components/tasks-tracking/jira/RequestJiraAuth.vue'
import CreateJiraIssue from '~/components/tasks-tracking/jira/CreateJiraIssue.vue'
definePageMeta({ middleware: 'auth' })

const { getDocs, isLoading } = useFirestore()

const jiraIssues = useState<Task[]>('jiraIssues', () => [])

const jiraAuth = useState('jiraAuth', () => '')
const requestJiraAuthModal = ref(false)

onMounted(() => {
  getJiraAuthCredentials()
})

async function getJiraAuthCredentials () {
  const response = await getDocs(APPS_INTEGRATIONS_PATH, [
    where('name', '==', 'JIRA')
  ])
  if (!response.data.length) {
    requestJiraAuthModal.value = true
  } else {
    jiraAuth.value = response.data[0].auth
    await getJiraTasks()
  }
}

async function getJiraTasks () {
  const { data } = await getDocs(TRACKING_JIRA_TASKS_PATH, [
    orderBy('created', 'desc')
  ])
  if (data) {
    jiraIssues.value = data
  }
}

function removeIssue (issue: Task) {
  jiraIssues.value = jiraIssues.value.filter(t => t.id !== issue.id)
}
</script>

<template>
  <main class="container mx-auto px-4">
    <div class="flex justify-between items-center mb-4">
      <div class="breadcrumbs text-neutral">
        <ul>
          <li>
            <NuxtLink :to="{ name: 'registro-de-tiempos' }">
              Registro de tiempos
            </NuxtLink>
          </li>
          <li><a>JIRA</a></li>
        </ul>
      </div>
      <CreateJiraIssue v-if="!requestJiraAuthModal" @on-create-jira-task="getJiraTasks()" />
    </div>
    <section>
      <AppLoader v-if="isLoading" class="mx-auto mt-40" />
      <ul v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg: gap-4">
        <li v-for="issue in jiraIssues" :key="issue.id">
          <JiraIssueCard :key="issue.id" :issue="issue" @on-deleted="removeIssue($event)" />
        </li>
      </ul>
    </section>
    <AppModal v-model="requestJiraAuthModal" persistent>
      <RequestJiraAuth @on-save-credentials="getJiraAuthCredentials(); requestJiraAuthModal = false" />
    </AppModal>
  </main>
</template>
