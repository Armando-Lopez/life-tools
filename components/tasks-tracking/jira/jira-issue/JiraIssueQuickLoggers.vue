<script setup lang="ts">
import { QuickTimeLogger, Task } from '~/interfaces/tasksTracking'
import { emit } from '~/helpers/eventBus'
import JiraIssueQuickLoggerCreate from '~/components/tasks-tracking/jira/jira-issue/JiraIssueQuickLoggerCreate.vue'
import { JIRA_TIMESTAMP_FORMAT } from '~/constants/tasksTrackingConstants'

const { isLoading: isLoadingDeleteLogger, updateDoc } = useFirestore()
const { isLoading: isJiraIssueLoading, getJiraIssueWorkLogs, createJiraIssueWorkLog } = useJiraIssue()
const { textTimeToSeconds, now } = useTime()

const jiraIssue = inject<Task>('jiraIssue', {} as Task)

const createLoggerModal = ref(false)
const quickLoggers = ref<QuickTimeLogger[]>(Object.values(jiraIssue.quickLoggers || {} as QuickTimeLogger))

onMounted(getTodayWorkLogs)

function addQuickLogger (logger: QuickTimeLogger) {
  quickLoggers.value.push(logger)
  createLoggerModal.value = false
}

async function getTodayWorkLogs () {
  if (!quickLoggers?.value.length) { return }
  const todayAtMidnightInMilliseconds = now().set('h', 0).set('m', 0).set('s', 0).valueOf()
  const { data } = await getJiraIssueWorkLogs({
    issueCode: jiraIssue.code,
    startedAfter: todayAtMidnightInMilliseconds
  })
  if (!data.worklogs?.length) { return }
  quickLoggers.value = quickLoggers.value.map((logger) => {
    const hasTodayWorkLog = data.worklogs.some((workLog: any) => {
      const [h, m] = jiraIssue.quickLoggers?.value[0].time.split(':').map(t => Number(t))
      const loggerTodayStarted = now().set('h', h).set('m', m).set('s', 0).format(JIRA_TIMESTAMP_FORMAT)
      return workLog.started === loggerTodayStarted
    })
    return { ...logger, hasTodayWorkLog }
  })
}

async function addJiraTodayLog (logger: QuickTimeLogger) {
  const [h, m] = logger.time.split(':').map(t => Number(t))
  const started = now().set('h', h).set('m', m).set('s', 0).format(JIRA_TIMESTAMP_FORMAT)
  const timeSpentSeconds = textTimeToSeconds(logger.duration)
  const { data } = await createJiraIssueWorkLog({
    issueCode: jiraIssue.code,
    started,
    timeSpentSeconds
  })
  if (data) {
    logger.hasTodayWorkLog = true
    emit('toast:open', {
      type: 'SUCCESS',
      title: logger.name,
      message: 'Tiempo registrado'
    })
  } else {
    emit('toast:open', {
      type: 'SUCCESS',
      title: logger.name,
      message: 'No se puso registrar el tiempo'
    })
  }
}

async function deleteQuickLogger (logger: QuickTimeLogger) {
  if (confirm('No se eliminarán los registros de tiempo en JIRA. ¿Eliminar registro rápido?')) {
    // @ts-ignore
    delete jiraIssue.quickLoggers[`${logger.id}`]
    const { error } = await updateDoc(jiraIssue.path, {
      quickLoggers: jiraIssue.quickLoggers
    })
    if (!error) {
      quickLoggers.value = quickLoggers.value.filter(l => l.id !== logger.id)
    }
  }
}
</script>

<template>
  <div>
    <button v-if="!quickLoggers.length" class="btn btn-sm shadow bg-base-100" @click="createLoggerModal = true">
      <AppIcon icon="tabler:clock-plus" width="20" class="text-green-600" />
      <span class="text-sm">Crear Registro rápido</span>
    </button>
    <div v-else>
      <ul class="divide-y divide-neutral-content/1">
        <li v-for="logger in quickLoggers" :key="logger.id" class="flex flex-wrap items-center gap-2">
          <span v-if="isJiraIssueLoading" class="loading loading-spinner text-green-500" />
          <template v-else>
            <div v-if="logger.hasTodayWorkLog" class="flex gap-2 items-center">
              <AppIcon icon="tabler:clock-check" width="20" class="text-green-500" />
              Hoy registrado
            </div>
            <button
              v-else
              class="flex btn btn-sm p-0.5 shadow bg-base-100"
              :disabled="isJiraIssueLoading"
              @click="addJiraTodayLog(logger)"
            >
              <AppIcon icon="solar:play-bold" width="20" class="text-green-500" />
              Registrar hoy
            </button>
          </template>
          <p>
            <strong>{{ logger.name }}</strong>
            -
            De <span>{{ logger.duration }}</span> a las {{ logger.time }}
          </p>
          <button
            class="btn btn-sm p-0 shadow"
            title="Eliminar registro rápido"
            :disabled="isLoadingDeleteLogger"
            @click="deleteQuickLogger(logger)"
          >
            <AppIcon icon="material-symbols:delete" width="20" class="text-red-500" />
          </button>
        </li>
      </ul>
    </div>
    <JiraIssueQuickLoggerCreate
      v-if="createLoggerModal"
      @on-logger-created="addQuickLogger($event)"
      @on-close="createLoggerModal = false"
    />
  </div>
</template>
