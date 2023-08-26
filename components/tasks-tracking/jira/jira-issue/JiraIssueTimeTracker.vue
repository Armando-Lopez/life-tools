<script setup lang="ts">
import { Task, TimeLog } from '~/interfaces/tasksTracking'
import {
  JIRA_ISSUE_TRANSITIONS_URL_API,
  JIRA_ISSUE_WORK_LOG_URL_API
} from '~/constants/api'
import { generateId } from '~/helpers'

const { updateDoc } = useFirestore()
const { now } = useTime()

const updateWorkLogInterval = 60
const currentWorkLog = ref<TimeLog|null>(null)
const jiraSettings = useState('jiraSettings')
const jiraIssue = inject<Task>('jiraIssue', {})

const timeSpentSeconds = computed<number>((): number => {
  let totalTimeSeconds = 0
  for (const logItem in jiraIssue.timeLogs) {
    // @ts-ignore
    totalTimeSeconds += jiraIssue.timeLogs[logItem].timeSpentSeconds
  }
  return totalTimeSeconds
})

const { isPending: isTracking, start, stop } = useTimeoutFn(handleTracking, 1000)
stop()
function handleTracking () {
  if (currentWorkLog.value) {
    currentWorkLog.value.timeSpentSeconds = now().diff(now(currentWorkLog.value.startedAt), 'seconds')
    if (currentWorkLog.value.timeSpentSeconds % updateWorkLogInterval === 0) {
      updateWorkLog()
    }
    if (currentWorkLog.value.timeSpentSeconds % jiraSettings.value.jiraUpdateIntervalInSeconds === 0) {
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
  if (jiraSettings.value.autoMoveIssueToProgress) {
    updateJiraIssueStatus()
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
  const { data } = await updateDoc(jiraIssue.path as string, {
    [`timeLogs.${id}`]: logItem
  })
  if (data) {
    currentWorkLog.value = logItem
    jiraIssue.timeLogs = {
      ...jiraIssue.timeLogs,
      [id]: logItem
    }
  } else {
    stopTracking()
  }
}

async function updateWorkLog () {
  if (currentWorkLog.value) {
    const { error } = await updateDoc(jiraIssue.path as string, {
      [`timeLogs.${currentWorkLog.value.id}`]: currentWorkLog.value
    })
    if (error) {
      stopTracking()
    }
  }
}

async function updateJiraIssueStatus () {
  try {
    const { data: issueTransitions } = await useFetch(JIRA_ISSUE_TRANSITIONS_URL_API, {
      // @ts-ignore
      headers: { authorization: useState('jiraAuth').value },
      server: false,
      query: { issueCode: jiraIssue.code }
    })
    if (!issueTransitions.value?.length) {
      return
    }
    const progressStatus = issueTransitions.value.find((p: any) => p.code === 'IN_PROGRESS')
    if (!progressStatus) {
      return
    }
    await useFetch(JIRA_ISSUE_TRANSITIONS_URL_API, {
      // @ts-ignore
      headers: { authorization: useState('jiraAuth').value },
      method: 'POST',
      body: { issueCode: jiraIssue.code, toStatusId: progressStatus.id }
    })
  } catch (e) {
    console.error(e)
  }
}
async function createJiraIssueWorkLog () {
  try {
    if (!currentWorkLog.value) { return }
    const { data } = await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
      method: 'POST',
      // @ts-ignore
      headers: { authorization: useState('jiraAuth').value },
      body: {
        issue: jiraIssue.code,
        timeSpentSeconds: currentWorkLog.value.timeSpentSeconds,
        started: currentWorkLog.value.startedAt
      }
    })
    // @ts-ignore
    currentWorkLog.value.jiraWorkLogId = data.value.id
    const { error } = await updateDoc(jiraIssue.path as string, {
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
    await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
      method: 'PUT',
      // @ts-ignore
      headers: { authorization: useState('jiraAuth').value },
      body: {
        issue: jiraIssue.code,
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
  updateDoc(jiraIssue.path as string, {
    [`timeLogs.${currentWorkLog.value?.id}`]: currentWorkLog.value
  })
  updateJiraIssueWorkLog()
  currentWorkLog.value = null
}
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div>
      <button v-if="!isTracking" title="Empezar nuevo registro" @click="startTracking()">
        <AppIcon icon="solar:play-bold" width="31" class="text-green-500" />
      </button>
      <button v-else title="Detener registro" @click="stopTracking()">
        <AppIcon icon="solar:stop-bold" width="31" class="text-orange-600" />
      </button>
    </div>
    <AppCountdown :seconds="timeSpentSeconds" class="text-xl" />
  </div>
</template>
