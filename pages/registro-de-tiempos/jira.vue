<script setup lang="ts">
import { where } from 'firebase/firestore'
import { APPS_INTEGRATIONS_PATH } from '~/constants/firebaseConstants'
import RequestJiraAuth from '~/components/tasks-tracking/jira/RequestJiraAuth.vue'
import JiraSettings from '~/components/tasks-tracking/jira/JiraSettings.vue'
import JiraIssuesList from '~/components/tasks-tracking/jira/JiraIssuesList.vue'
definePageMeta({ middleware: 'auth' })

const { getDocs } = useFirestore()

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
  }
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
    <JiraIssuesList v-if="jiraAuth" />
    <AppModal v-model="requestJiraAuthModal" persistent>
      <RequestJiraAuth @on-save-credentials="getJiraAuthCredentials(); requestJiraAuthModal = false" />
    </AppModal>
  </main>
</template>
