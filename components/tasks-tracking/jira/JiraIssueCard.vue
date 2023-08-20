<script setup lang="ts">
import { Task, TimeLog } from '~/interfaces/tasksTracking'
import { generateId } from '~/helpers'
import { JIRA_ISSUE_URL_API, JIRA_ISSUE_WORK_LOG_URL_API } from '~/constants/api'

const props = defineProps<{ issue: Task }>()
const emit = defineEmits(['onDeleted'])

const { updateDoc, deleteDoc } = useFirestore()
const { now } = useTime()
const { isPending: isTracking, start, stop } = useTimeoutFn(handleTracking, 1000)
stop()

const jiraIssue = ref<Task>(props.issue)
const currentWorkLog = ref<TimeLog|null>(null)
const updateWorkLogInterval = 60

const timeSpentSeconds = computed<number>((): number => {
  let totalTimeSeconds = 0
  for (const logItem in jiraIssue.value.timeLogs) {
    // @ts-ignore
    totalTimeSeconds += jiraIssue.value.timeLogs[logItem].timeSpentSeconds
  }
  return totalTimeSeconds
})

const { execute: getJiraIssue } = await useFetch(JIRA_ISSUE_URL_API, {
  lazy: true,
  server: false,
  immediate: false,
  // @ts-ignore
  headers: { authorization: useState('jiraAuth').value },
  query: { issueCode: jiraIssue.value.code }
})

function handleTracking () {
  if (currentWorkLog.value) {
    currentWorkLog.value.timeSpentSeconds = now().diff(now(currentWorkLog.value.startedAt), 'seconds')
    if (currentWorkLog.value.timeSpentSeconds % updateWorkLogInterval === 0) {
      updateWorkLog()
      if (currentWorkLog.value.jiraWorkLogId) {
        updateJiraIssueWorkLog()
      } else {
        createJiraIssueWorkLog()
      }
    }
  }
  start()
}
function startTracking () {
  if (!currentWorkLog.value) {
    createTimeLog()
  }
  start()
}
async function createTimeLog () {
  const id = generateId()
  const logItem: TimeLog = {
    id,
    jiraWorkLogId: '',
    startedAt: now().format('YYYY-MM-DDTHH:mm:ss.000-0500'),
    timeSpentSeconds: 0
  }
  const { data } = await updateDoc(jiraIssue.value.path as string, {
    [`timeLogs.${id}`]: logItem
  })
  if (data) {
    currentWorkLog.value = logItem
    jiraIssue.value.timeLogs = {
      ...jiraIssue.value.timeLogs,
      [id]: logItem
    }
  } else {
    stopTracking()
  }
}
async function updateWorkLog () {
  if (currentWorkLog.value) {
    const { error } = await updateDoc(jiraIssue.value.path as string, {
      [`timeLogs.${currentWorkLog.value.id}`]: currentWorkLog.value
    })
    if (error) {
      stopTracking()
    }
  }
}

async function createJiraIssueWorkLog () {
  try {
    if (!currentWorkLog.value) { return }
    const { data } = await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
      method: 'POST',
      headers: { authorization: useState('jiraAuth').value },
      body: {
        issue: jiraIssue.value.code,
        timeSpentSeconds: currentWorkLog.value.timeSpentSeconds,
        started: currentWorkLog.value.startedAt
      }
    })
    // @ts-ignore
    currentWorkLog.value.jiraWorkLogId = data.value.id
    const { error } = await updateDoc(jiraIssue.value.path as string, {
      [`timeLogs.${currentWorkLog.value.id}.jiraWorkLogId`]: currentWorkLog.value.jiraWorkLogId
    })
    if (error) {
      stopTracking()
    }
  } catch (e) {
    console.error(e)
  }
}
async function updateJiraIssueWorkLog () {
  try {
    if (!currentWorkLog.value?.jiraWorkLogId) { return }
    await useFetch('/api/auth/jira/issue-worklog', {
      method: 'PUT',
      headers: { authorization: useState('jiraAuth').value },
      body: {
        issue: jiraIssue.value.code,
        started: currentWorkLog.value.startedAt,
        timeSpentSeconds: currentWorkLog.value.timeSpentSeconds,
        workLogId: currentWorkLog.value.jiraWorkLogId
      }
    })
  } catch (e) {
    console.error(e)
  }
}
function stopTracking () {
  stop()
  updateDoc(jiraIssue.value.path as string, {
    [`timeLogs.${currentWorkLog.value?.id}`]: currentWorkLog.value
  })
  updateJiraIssueWorkLog()
  currentWorkLog.value = null
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
    <div class="flex flex-wrap items-center justify-between">
      <h2 class="card-title">
        {{ jiraIssue.code }}
      </h2>
      <div>
        <AppDropdown>
          <template #activator>
            <AppIcon icon="simple-line-icons:options" width="25" />
          </template>
          <button class="flex" @click="confirmDelete">
            <AppIcon icon="material-symbols:delete" width="30" class="text-red-500" />
          </button>
        </AppDropdown>
      </div>
      <p class="w-full line-clamp-1">
        {{ jiraIssue.description }}
      </p>
    </div>
    <div class="flex items-center justify-between gap-4">
      <div>
        <button v-if="!isTracking" title="Empezar nuevo registro" @click="startTracking">
          <AppIcon icon="solar:play-bold" width="30" class="text-green-500" />
        </button>
        <button v-else title="Detener registro" @click="stopTracking">
          <AppIcon icon="solar:stop-bold" width="30" class="text-orange-600" />
        </button>
      </div>
      <AppCountdown :seconds="timeSpentSeconds" />
    </div>
    <div>
      <button @click="getJiraIssue">
        <AppIcon icon="tabler:calendar-stats" width="30" class="text-info" />
      </button>
    </div>
  </AppCard>
</template>
