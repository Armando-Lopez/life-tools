<script setup lang="ts">
import { orderBy } from 'firebase/firestore'
import { Task } from '~/interfaces/tasksTracking'
import { TRACKING_JIRA_PATH } from '~/constants/firebaseConstants'
import CreateJiraIssue from '~/components/tasks-tracking/jira/CreateJiraIssue.vue'
import JiraIssue from '~/components/tasks-tracking/jira/jira-issue/JiraIssue.vue'

const { getDocs, isLoading } = useFirestore()

const jiraIssues = useJiraIssues()

const pinnedJiraIssues = computed<Task[]>(() => jiraIssues.value.filter((issue: Task) => issue.isPinned))
const noPinnedJiraIssues = computed<Task[]>(() => jiraIssues.value.filter((issue: Task) => !issue.isPinned))

onMounted(getJiraTasks)

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
  <section>
    <div class="my-4">
      <CreateJiraIssue @on-create-jira-issue="addJiraIssue($event)" />
    </div>
    <AppLoader v-if="isLoading" class="mx-auto mt-40" />
    <div v-else>
      <p class="flex items-center mb-2">
        <AppIcon icon="mdi:pin" width="20" />
        Ancladas
      </p>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg: gap-4">
        <li v-for="issue in pinnedJiraIssues" :key="issue.id">
          <JiraIssue :key="issue.id" :issue="issue" @on-deleted="removeIssue($event)" />
        </li>
      </ul>
      <div class="divider" />
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg: gap-4">
        <li v-for="issue in noPinnedJiraIssues" :key="issue.id">
          <JiraIssue :key="issue.id" :issue="issue" @on-deleted="removeIssue($event)" />
        </li>
      </ul>
    </div>
  </section>
</template>
