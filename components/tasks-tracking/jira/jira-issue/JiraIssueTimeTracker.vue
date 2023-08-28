<script setup lang="ts">
import { Task, TimeLog } from '~/interfaces/tasksTracking'
import { JIRA_ISSUE_TRANSITIONS_URL_API, JIRA_ISSUE_WORK_LOG_URL_API } from '~/constants/api'
import { JIRA_TIMESTAMP_FORMAT } from '~/constants/tasksTrackingConstants'
import { generateId } from '~/helpers'
import { emit } from '~/helpers/eventBus'

const { updateDoc } = useFirestore()
const { now, duration } = useTime()

const jiraIssue = inject<Task>('jiraIssue', {} as Task)
const currentWorkLog = ref<TimeLog|null>(null)
const isCreatingTimeLog = ref(false)
const jiraSettings = useState('jiraSettings')
const updateWorkLogInterval = 60

const { isPending: isTracking, start, stop } = useTimeoutFn(handleTracking, 1000)
stop()

onMounted(() => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') { return }
    if (currentWorkLog.value?.timeSpentSeconds || 0 >= 60) {
      updateJiraIssueWorkLog()
    }
  })
})
onBeforeMount(stop)

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
    start()
  }
}
async function startTracking () {
  if (!currentWorkLog.value) {
    await createTimeLog()
  }
  if (jiraSettings.value.autoMoveIssueToProgress) {
    updateJiraIssueStatus()
  }
  start()
}
async function createTimeLog () {
  try {
    isCreatingTimeLog.value = true
    const id = generateId()
    const logItem: TimeLog = {
      id,
      jiraWorkLogId: '',
      startedAt: now().format(JIRA_TIMESTAMP_FORMAT),
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
  } finally {
    isCreatingTimeLog.value = false
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
    const { data } = await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
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
    if (data.value && !isTracking) {
      let message = ''
      const { days, hours, minutes, seconds } = duration(currentWorkLog.value.timeSpentSeconds)
      if (days) { message += `${days}d ` }
      if (hours) { message += `${hours}h ` }
      if (minutes) { message += `${minutes}m ` }
      if (seconds) { message += `${seconds}s` }
      emit('toast:open', {
        type: 'SUCCESS',
        title: jiraIssue.code,
        message: `${message} registrado en JIRA`
      })
    }
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
  <div class="flex flex-wrap items-center justify-between gap-4">
    <button
      v-if="!isTracking"
      class="btn btn-sm px-0 shadow bg-base-100"
      :disabled="isCreatingTimeLog"
      @click="startTracking()"
    >
      <AppIcon icon="solar:play-bold" width="25" class="text-green-500" />
      Empezar conteo
    </button>
    <button v-else class="btn btn-sm px-0 shadow bg-base-100" @click="stopTracking()">
      <AppIcon icon="solar:stop-bold" width="25" class="text-orange-600" />
      {{ currentWorkLog?.timeSpentSeconds > 60 ? 'Detener y guardar' : 'Detener' }}
    </button>
    <AppCountdown :seconds="currentWorkLog?.timeSpentSeconds || 0" class="text-2xl" />
  </div>
</template>
