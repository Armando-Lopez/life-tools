<script setup lang="ts">
import axios from 'axios'
import { Task, TimeLog } from '~/interfaces/tasksTracking'
import { useTasksTrackingStore } from '~/stores/tasksTraking'
import { generateId } from '~/helpers'

const props = defineProps<{ task: Task }>()

const tasksStore = useTasksTrackingStore()
const { now, duration: durationTime } = useTime()

const updateWorkLogInterval = 60
const currentWorkLog = ref<TimeLog|null>(null)

const duration = computed(() => {
  let totalTimeSeconds = 0
  for (const logItem in props.task.workLogs) {
    totalTimeSeconds += props.task.workLogs[logItem].timeSpentSeconds
  }
  const d = durationTime((totalTimeSeconds || 0) * 1000)
  return {
    days: d.days(),
    hours: d.hours(),
    minutes: d.minutes(),
    seconds: d.seconds()
  }
})

const { isPending: isTracking, start, stop } = useTimeoutFn(handleTracking, 1000)
stop()

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
    createWorkLog()
  }
  start()
}
async function createWorkLog () {
  const id = generateId()
  const logItem: TimeLog = {
    id,
    jiraWorkLogId: '',
    startedAt: now().format('YYYY-MM-DDTHH:mm:ss.000-0500'),
    timeSpentSeconds: 0
  }
  const hasCreated = await tasksStore.updateTask(props.task.id, {
    [`workLogs.${id}`]: logItem
  })
  if (hasCreated) {
    currentWorkLog.value = logItem
    const storedTask = tasksStore.tasks.data.find(t => t.id === props.task.id)
    storedTask!.workLogs = {
      ...storedTask!.workLogs,
      [id]: logItem
    }
  } else {
    stopTracking()
  }
}
async function updateWorkLog () {
  if (currentWorkLog.value) {
    const success = await tasksStore.updateTask(props.task.id, {
      [`workLogs.${currentWorkLog.value.id}`]: currentWorkLog.value
    })
    if (!success) {
      stopTracking()
    }
  }
}
async function createJiraIssueWorkLog () {
  try {
    if (!currentWorkLog.value) { return }
    const response = await axios.post('/api/auth/jira/issue-worklog', {
      issue: props.task.meta.code,
      timeSpentSeconds: currentWorkLog.value.timeSpentSeconds,
      started: currentWorkLog.value.startedAt
    })
    currentWorkLog.value.jiraWorkLogId = response.data.id
    await tasksStore.updateTask(props.task.id, {
      [`workLogs.${currentWorkLog.value.id}.jiraWorkLogId`]: response.data.id
    })
  } catch (e) {
    console.error(e)
  }
}
async function updateJiraIssueWorkLog () {
  try {
    if (!currentWorkLog.value) { return }
    await axios.put('/api/auth/jira/issue-worklog',
      {
        issue: props.task.meta.code,
        started: currentWorkLog.value.startedAt,
        timeSpentSeconds: currentWorkLog.value.timeSpentSeconds,
        workLogId: currentWorkLog.value.jiraWorkLogId
      }
    )
  } catch (e) {
    console.error(e)
  }
}
function stopTracking () {
  stop()
  tasksStore.updateTask(props.task.id, {
    [`workLogs.${currentWorkLog?.value?.id}`]: currentWorkLog.value
  })
  updateJiraIssueWorkLog()
  currentWorkLog.value = null
}
function confirmDelete () {
  const canDelete = confirm('¿Eliminar tarea?')
  if (canDelete) {
    tasksStore.deleteTask(props.task.id || null)
  }
}
</script>

<template>
  <AppCard class="w-80">
    <span>{{ props.task.meta.code }}</span>
    <h2 class="card-title">
      {{ props.task.name }}
    </h2>
    <div class="flex justify-between gap-4">
      <div>
        <button v-if="!isTracking" @click="startTracking">
          <AppIcon icon="solar:play-bold" width="30" class="text-green-500" />
        </button>
        <button v-else @click="stopTracking">
          <AppIcon icon="solar:stop-bold" width="30" class="text-orange-600" />
        </button>
      </div>
      <button @click="confirmDelete">
        <AppIcon icon="material-symbols:delete" width="30" class="text-red-600" />
      </button>
    </div>
    <div class="flex justify-between gap-5 text-center auto-cols-max">
      <div class="flex flex-col">
        <span class="countdown font-mono text-3xl">
          <span :style="`--value:${duration.days};`" />
        </span>
        Días
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-3xl">
          <span :style="`--value:${duration.hours};`" />
        </span>
        Horas
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-3xl">
          <span :style="`--value:${duration.minutes};`" />
        </span>
        Minutos
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-3xl">
          <span :style="`--value:${duration.seconds};`" />
        </span>
        Segundos
      </div>
    </div>
    <div class="divider m-0" />
    <!--    <p>{{ props.task.description }}</p>-->
  </AppCard>
</template>
