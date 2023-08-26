<script setup lang="ts">
import { QuickTimeLogger, Task } from '~/interfaces/tasksTracking'
import { generateId } from '~/helpers'
import { emit } from '~/helpers/eventBus'

const { isLoading: isCreateLoggerLoading, updateDoc } = useFirestore()
const { isLoading: isJiraIssueLoading, getJiraIssueWorkLogs, createJiraIssueWorkLog } = useJiraIssue()
const { textTimeToSeconds, now } = useTime()

const jiraIssue = inject<Task>('jiraIssue', {} as Task)

const loggerModal = ref(false)
const formRef = ref(null)
const quickLoggers = ref<QuickTimeLogger[]>(Object.values(jiraIssue.quickLoggers || {} as QuickTimeLogger))
const hasTodayWorkLog = ref(false)
const model = ref<QuickTimeLogger>({
  duration: '',
  name: '',
  time: ''
})

onMounted(getTodayWorkLogs)

async function getTodayWorkLogs () {
  if (!quickLoggers.value.length) { return }
  const started = now().set('h', 0).set('m', 0).set('s', 0).valueOf()
  const { data } = await getJiraIssueWorkLogs({
    issueCode: jiraIssue.code,
    startedAfter: started
  })
  if (data.worklogs?.length) {
    hasTodayWorkLog.value = data.worklogs.some((workLog: any) => {
      const [h, m] = quickLoggers.value[0].time.split(':').map(t => Number(t))
      const loggerTodayStarted = now().set('h', h).set('m', m).set('s', 0).format('YYYY-MM-DDTHH:mm:ss.000-0500')
      return workLog.started === loggerTodayStarted
    })
  }
}

async function addQuickLogger () {
  const id = generateId()
  const logger = {
    ...model.value,
    id
  }
  const { data } = await updateDoc(jiraIssue.path, {
    [`quickLoggers.${id}`]: logger
  })
  if (data) {
    quickLoggers.value.push(logger)
    // @ts-ignore
    formRef.value.resetForm()
    loggerModal.value = false
  }
}

async function createTodayLog (logger: QuickTimeLogger) {
  const [h, m] = logger.time.split(':').map(t => Number(t))
  const started = now().set('h', h).set('m', m).set('s', 0).format('YYYY-MM-DDTHH:mm:ss.000-0500')
  const timeSpentSeconds = textTimeToSeconds(logger.duration)
  const { data } = await createJiraIssueWorkLog({
    issueCode: jiraIssue.code as string,
    started,
    timeSpentSeconds
  })
  if (data) {
    hasTodayWorkLog.value = true
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
</script>

<template>
  <div>
    <button v-if="!quickLoggers.length" class="mb-2 btn btn-sm shadow bg-base-100" @click="loggerModal = true">
      <AppIcon icon="tabler:clock-plus" width="20" class="text-green-600" />
      <span class="text-sm">Crear Registro rápido</span>
    </button>
    <div v-else>
      <ul class="divide-y divide-neutral-content/1">
        <li v-for="logger in quickLoggers" :key="logger.id" class="flex items-center gap-2">
          <p>
            <strong>{{ logger.name }}</strong>
            -
            De <span>{{ logger.duration }}</span> a las {{ logger.time }}
          </p>
          <span v-if="isJiraIssueLoading" class="loading loading-spinner text-green-500" />
          <div v-else-if="hasTodayWorkLog" class="flex gap-2 items-center">
            <AppIcon icon="tabler:clock-check" width="20" class="text-green-500" />
            Hoy registrado
          </div>
          <button
            v-else
            class="flex btn btn-sm shadow bg-base-100"
            :disabled="isJiraIssueLoading"
            @click="createTodayLog(logger)"
          >
            <AppIcon icon="solar:play-bold" width="20" class="text-green-500" />
            Registrar hoy
          </button>
          <!--            <AppIcon icon="mingcute:check-fill" width="20" class="text-green-500" />-->
          <!--            <button>-->
          <!--              <AppIcon icon="material-symbols:delete" width="20" class="text-red-500" />-->
          <!--            </button>-->
        </li>
      </ul>
    </div>
    <AppModal v-model="loggerModal">
      <p class="mb-4 text-xl font-bold">
        Crear registros rapidos
      </p>
      <p>
        Haz más rápido el registro para horarios repetitivos en esta tarea
      </p>
      <AppForm
        ref="formRef"
        v-model="model"
        autocomplete="off"
        :is-loading="isCreateLoggerLoading"
        @success="addQuickLogger"
      >
        <AppTextField
          label="Nombre"
          name="name"
          rules="required|max:100"
        />
        <AppTextField
          label="Hora de inicio"
          name="time"
          type="time"
          rules="required"
        />
        <AppTextField
          label="Duración"
          name="duration"
          :rules="{
            required: true,
            regex: /^\d+[dhm](?:\s+\d+[dhm])*$/
          }"
          hint="Usa este formato: 1h 45m"
        />
        <button class="btn btn-block btn-success mt-4">
          <span>Guardar</span>
          <span v-show="isCreateLoggerLoading" class="loading loading-spinner" />
        </button>
      </AppForm>
    </AppModal>
  </div>
</template>
