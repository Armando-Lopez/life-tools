<script setup lang="ts">
import { orderBy, where } from 'firebase/firestore'
import { Task } from '~/interfaces/tasksTracking'
import { APPS_INTEGRATIONS_PATH, TRACKING_JIRA_PATH } from '~/constants/firebaseConstants'
import JiraIssueCard from '~/components/tasks-tracking/jira/JiraIssueCard.vue'
import RequestJiraAuth from '~/components/tasks-tracking/jira/RequestJiraAuth.vue'
import CreateJiraIssue from '~/components/tasks-tracking/jira/CreateJiraIssue.vue'
import JiraSettings from '~/components/tasks-tracking/jira/JiraSettings.vue'
definePageMeta({ middleware: 'auth' })

const { getDocs, isLoading } = useFirestore()

const jiraIssues = useJiraIssues()

const jiraAuth = useState('jiraAuth', () => '')
const jiraUserId = useState('jiraUserId', () => '')
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
    jiraUserId.value = response.data[0].accountId
    await getJiraTasks()
  }
}

async function getJiraTasks () {
  const { data } = await getDocs(TRACKING_JIRA_PATH, [
    orderBy('created', 'desc')
  ])
  if (data) {
    jiraIssues.value = data
  }
}
function addJiraIssue (issue: Task) {
  jiraIssues.value.unshift(issue)
}
function removeIssue (issue: Task) {
  jiraIssues.value = jiraIssues.value.filter((t: any) => t.id !== issue.id)
}
</script>

<template>
  <main class="container mx-auto px-4">
    <div class="flex justify-between items-center">
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
      <JiraSettings />
    </div>
    <section>
      <div class="my-4">
        <CreateJiraIssue v-if="!requestJiraAuthModal" @on-create-jira-issue="addJiraIssue($event)" />
      </div>
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
