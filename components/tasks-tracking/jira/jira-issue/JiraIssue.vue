<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import JiraIssueTimeTracker from '~/components/tasks-tracking/jira/jira-issue/JiraIssueTimeTracker.vue'
import JiraIssueQuickLoggers from '~/components/tasks-tracking/jira/jira-issue/JiraIssueQuickLoggers.vue'
import JiraIssueDetails from '~/components/tasks-tracking/jira/jira-issue/JiraIssueDetails.vue'

const props = defineProps<{ issue: Task }>()
const emit = defineEmits(['onDeleted'])

const { deleteDoc, updateDoc } = useFirestore()

const jiraIssues = useJiraIssues()
const jiraIssue = ref<Task>(props.issue)

provide('jiraIssue', jiraIssue.value)
provide('updateJiraIssue', (newValue: Task) => (jiraIssue.value = newValue))

async function togglePinJiraIssue () {
  const newValue = Boolean(!jiraIssue.value.isPinned)
  const { data } = await updateDoc(jiraIssue.value.path, { isPinned: newValue })
  if (data) {
    const index = jiraIssues.value.findIndex((i: Task) => i.id === jiraIssue.value.id)
    jiraIssues.value[index].isPinned = newValue
  }
}

async function confirmDelete () {
  const canDelete = confirm('No se eliminarán los registros de tiempo en JIRA. ¿Eliminar tarea?')
  if (canDelete) {
    const hasDelete = await deleteDoc(jiraIssue.value.path as string)
    if (hasDelete) {
      emit('onDeleted', jiraIssue.value)
    }
  }
}
</script>

<template>
  <AppCard class="max-w-none">
    <div class="flex items-center justify-between">
      <h2 class="card-title">
        {{ jiraIssue.code }}
      </h2>
      <AppDropdown content-class="w-52 divide-y divide-neutral-content/10">
        <template #activator>
          <AppIcon icon="fluent:settings-28-filled" width="20" title="administrar insidencia" />
        </template>
        <li>
          <button class="flex" @click="togglePinJiraIssue()">
            <AppIcon icon="mdi:pin" width="20" class="text-blue-500" />
            <span v-if="jiraIssue.isPinned">Desanclar del inicio</span>
            <span v-else>Anclar al inicio</span>
          </button>
        </li>
        <li>
          <button class="flex" @click="confirmDelete">
            <AppIcon icon="material-symbols:delete" width="20" class="text-red-500" />
            Eliminar
          </button>
        </li>
      </AppDropdown>
    </div>
    <p class="line-clamp-1">
      {{ jiraIssue.description }}
    </p>
    <JiraIssueTimeTracker />
    <div class="divider my-0" />
    <JiraIssueQuickLoggers />
    <div class="divider my-0" />
    <JiraIssueDetails :issue="jiraIssue" />
  </AppCard>
</template>
