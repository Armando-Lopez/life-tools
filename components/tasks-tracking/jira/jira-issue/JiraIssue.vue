<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import JiraIssueTimeTracker from '~/components/tasks-tracking/jira/jira-issue/JiraIssueTimeTracker.vue'
import JiraIssueQuickLoggers from '~/components/tasks-tracking/jira/jira-issue/JiraIssueQuickLoggers.vue'
import JiraIssueDetails from '~/components/tasks-tracking/jira/jira-issue/JiraIssueDetails.vue'

const props = defineProps<{ issue: Task }>()
const emit = defineEmits(['onTogglePin', 'onDeleted'])

const { deleteDoc, updateDoc } = useFirestore()

provide('jiraIssue', props.issue)

async function togglePinJiraIssue () {
  const newValue = Boolean(!props.issue.isPinned)
  const { data } = await updateDoc(props.issue.path, { isPinned: newValue })
  if (data) {
    emit('onTogglePin', { id: props.issue.id, isPinned: newValue })
  }
}

async function confirmDelete () {
  const canDelete = confirm('No se eliminarán los registros de tiempo en JIRA. ¿Eliminar tarea?')
  if (canDelete) {
    const hasDelete = await deleteDoc(props.issue.path as string)
    if (hasDelete) {
      emit('onDeleted', props.issue)
    }
  }
}
</script>

<template>
  <AppCard class="max-w-none">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <AppIcon v-if="props.issue.isPinned" icon="mdi:pin" width="20" class="text-blue-500" />
        <h2 class="card-title">
          {{ props.issue.code }}
        </h2>
      </div>
      <AppDropdown content-class="w-52 divide-y divide-neutral-content/10">
        <template #activator>
          <AppIcon icon="fluent:settings-28-filled" width="25" title="administrar insidencia" />
        </template>
        <li>
          <button class="flex" @click="togglePinJiraIssue()">
            <AppIcon icon="mdi:pin" width="20" class="text-blue-500" />
            <span v-if="props.issue.isPinned">Desanclar del inicio</span>
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
      {{ props.issue.description }}
    </p>
    <JiraIssueTimeTracker />
    <div class="divider my-0" />
    <JiraIssueQuickLoggers />
    <JiraIssueDetails v-if="false" :issue="props.issue" />
  </AppCard>
</template>
