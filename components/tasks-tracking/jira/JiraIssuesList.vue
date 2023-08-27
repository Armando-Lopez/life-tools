<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import { TRACKING_JIRA_PATH } from '~/constants/firebaseConstants'
import CreateJiraIssue from '~/components/tasks-tracking/jira/CreateJiraIssue.vue'
import JiraIssue from '~/components/tasks-tracking/jira/jira-issue/JiraIssue.vue'

const { getDocs, isLoading } = useFirestore()

const jiraIssues = useJiraIssues()

onMounted(getJiraTasks)

async function getJiraTasks () {
  const { data } = await getDocs(TRACKING_JIRA_PATH)
  if (data) {
    jiraIssues.value = data
    jiraIssues.value.sort(sortIssues)
  }
}
function addJiraIssue (issue: Task) {
  jiraIssues.value.unshift(issue)
}
function togglePinIssue ({ id, isPinned }: any) {
  const index = jiraIssues.value.findIndex((i: Task) => i.id === id)
  jiraIssues.value[index].isPinned = isPinned
  jiraIssues.value.sort(sortIssues)
}
function removeIssue (issue: Task) {
  jiraIssues.value = jiraIssues.value.filter((i: Task) => i.id !== issue.id)
}
function sortIssues (a: any, b: any) {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1
  } else {
    return b.created < a.created ? -1 : 1
  }
}
</script>

<template>
  <section>
    <div class="my-4">
      <CreateJiraIssue @on-create-jira-issue="addJiraIssue($event)" />
    </div>
    <AppLoader v-if="isLoading" class="mx-auto mt-40" />
    <div v-else>
      <TransitionGroup
        tag="ul"
        name="issues-list"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg: gap-4"
        move-class="transition-all duration-500 ease-out"
      >
        <li v-for="issue in jiraIssues" :key="issue.id">
          <JiraIssue
            :key="issue.id"
            :issue="issue"
            @on-deleted="removeIssue($event)"
            @on-toggle-pin="togglePinIssue($event)"
          />
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>
