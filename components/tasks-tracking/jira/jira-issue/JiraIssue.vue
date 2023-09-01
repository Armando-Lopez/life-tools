<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'
import JiraIssueTimeTracker from '~/components/tasks-tracking/jira/jira-issue/JiraIssueTimeTracker.vue'
import JiraIssueQuickLoggers from '~/components/tasks-tracking/jira/jira-issue/JiraIssueQuickLoggers.vue'
import JiraIssueDetails from '~/components/tasks-tracking/jira/jira-issue/JiraIssueDetails.vue'
import JiraIssueSettings from '~/components/tasks-tracking/jira/jira-issue/JiraIssueSettings.vue'
import JiraIssueLogHistory from '~/components/tasks-tracking/jira/jira-issue/JiraIssueLogHistory.vue'
import JiraIssueCreateLog from '~/components/tasks-tracking/jira/jira-issue/JiraIssueCreateLog.vue'

const props = defineProps<{ issue: Task }>()
const emit = defineEmits(['onTogglePin', 'onDeleted'])

const createLogModal = ref(false)

provide('jiraIssue', props.issue)
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
      <JiraIssueSettings
        :issue="props.issue"
        @on-toggle-pin="emit('onTogglePin', $event)"
        @on-deleted="emit('onDeleted', $event)"
      />
    </div>
    <p class="line-clamp-1">
      {{ props.issue.description }}
    </p>
    <div class="divider my-0" />
    <JiraIssueTimeTracker />
    <div>
      <button class="btn btn-sm shadow bg-base-100" @click="createLogModal = true">
        <AppIcon icon="tabler:clock-edit" width="20" class="text-green-600" />
        <span class="text-sm">Registro rápido</span>
      </button>
      <JiraIssueCreateLog v-if="createLogModal" @onClose="createLogModal = false" />
    </div>
    <JiraIssueQuickLoggers />
    <div class="divider my-0" />
    <JiraIssueLogHistory :jira-issue="props.issue" />
    <JiraIssueDetails v-if="false" :issue="props.issue" />
  </AppCard>
</template>
