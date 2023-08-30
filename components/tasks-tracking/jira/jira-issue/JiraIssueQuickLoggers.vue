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
const confirmModal = ref({ isOpen: false, message: '', callback: () => {} })
let loggerExecutionIntervalId: any = null

onMounted(getTodayIssueWorkLogs)

function addQuickLogger (logger: QuickTimeLogger) {
  quickLoggers.value.push(logger)
  getTodayIssueWorkLogs()
  createLoggerModal.value = false
}

async function getTodayIssueWorkLogs () {
  if (!quickLoggers?.value.length) { return }
  const todayAtMidnightInMilliseconds = now().startOf('day').valueOf()
  const { data } = await getJiraIssueWorkLogs({
    issueCode: jiraIssue.code,
    startedAfter: todayAtMidnightInMilliseconds
  })
  if (!data.worklogs?.length) {
    handleQuickLoggerLogByMode(0)
    return
  }
  quickLoggers.value = quickLoggers.value.map((logger) => {
    const hasTodayWorkLog = data.worklogs.some((workLog: any) => {
      const [h, m] = logger.startAt.split(':').map((t : string) => Number(t))
      const loggerTodayStartAt = now().set('h', h).set('m', m).set('s', 0).format(JIRA_TIMESTAMP_FORMAT)
      return workLog.started === loggerTodayStartAt
    })
    return { ...logger, hasTodayWorkLog }
  })
  handleQuickLoggerLogByMode(0)
}

function handleQuickLoggerLogByMode (loggerIndex: number) {
  const logger = quickLoggers.value[loggerIndex]
  if (logger?.hasTodayWorkLog) { return }
  if (logger.mode === 'AUT') {
    loggerExecutionIntervalId = setInterval(() => {
      if (confirmModal.value.isOpen || isJiraIssueLoading.value) { return }
      const hourNow = now().format('HH:mm')
      const hasPassedLogTime = hourNow >= logger.startAt
      if (!hasPassedLogTime) { return }
      confirmModal.value.isOpen = true
      confirmModal.value.message = `¿Registrar ${logger.duration} en ${jiraIssue.description} (${jiraIssue.code}) hoy?`
      // @ts-ignore
      confirmModal.value.callback = async (value: boolean) => {
        if (value) {
          const success = await addJiraTodayLog(logger)
          if (success) {
            clearInterval(loggerExecutionIntervalId)
          }
        } else {
          clearInterval(loggerExecutionIntervalId)
        }
      }
    }, 2000)
  }
}

async function addJiraTodayLog (logger: QuickTimeLogger): Promise<Boolean> {
  const [h, m] = logger.startAt.split(':').map(t => Number(t))
  const startAt = now().set('h', h).set('m', m).set('s', 0).format(JIRA_TIMESTAMP_FORMAT)
  const timeSpentSeconds = textTimeToSeconds(logger.duration)
  const { data } = await createJiraIssueWorkLog({
    issueCode: jiraIssue.code,
    startAt,
    timeSpentSeconds
  })
  if (data) {
    logger.hasTodayWorkLog = true
    emit('toast:open', {
      type: 'SUCCESS',
      title: logger.name,
      message: 'Tiempo registrado en JIRA'
    })
    return true
  } else {
    emit('toast:open', {
      type: 'SUCCESS',
      title: logger.name,
      message: 'No se puso registrar el tiempo en JIRA'
    })
    return false
  }
}

async function deleteQuickLogger (logger: QuickTimeLogger) {
  if (confirm('No se eliminarán los registros de tiempo en JIRA. ¿Eliminar registro automático?')) {
    clearInterval(loggerExecutionIntervalId)
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
  <div class="mt-2">
    <button v-if="!quickLoggers.length" class="btn btn-sm mb-5 shadow bg-base-100" @click="createLoggerModal = true">
      <AppIcon icon="tabler:clock-plus" width="20" class="text-green-600" />
      <span class="text-sm">Registro programado</span>
    </button>
    <div v-else>
      <ul class="divide-y divide-neutral-content/1">
        <li v-for="logger in quickLoggers" :key="logger.id">
          <div class="flex">
            <p class="w-full">
              Registro programado
            </p>
            <button
              class="btn btn-sm p-0 ml-auto shadow bg-base-100"
              title="Eliminar registro automático"
              :disabled="isLoadingDeleteLogger"
              @click="deleteQuickLogger(logger)"
            >
              <AppIcon icon="material-symbols:delete" width="20" class="text-red-500" />
            </button>
          </div>
          <div class="flex gap-2">
            <AppIcon
              :icon="logger.hasTodayWorkLog ? 'tabler:clock-check' : 'mdi:clock-alert-outline'"
              width="20"
              :class="logger.hasTodayWorkLog ? 'text-green-500' : 'text-amber-500'"
            />
            {{ logger.duration }} a las {{ logger.startAt }}
            <strong v-if="logger.hasTodayWorkLog">
              Registrado hoy
            </strong>
            <strong v-else>Sin registrar hoy</strong>
          </div>
        </li>
      </ul>
    </div>
    <JiraIssueQuickLoggerCreate
      v-if="createLoggerModal"
      @on-logger-created="addQuickLogger($event)"
      @on-close="createLoggerModal = false"
    />
    <LazyAppConfirmModal
      v-if="confirmModal.isOpen"
      :message="confirmModal.message"
      :on-confirm-call-back="confirmModal.callback"
      @on-close="confirmModal.isOpen = false"
    />
  </div>
</template>
