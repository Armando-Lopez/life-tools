<script setup>
import CreateTask from '~/components/tasks-tracking/CreateTask.vue'
import { useTasksTrackingStore } from '~/stores/tasksTraking'
import TaskCard from '~/components/tasks-tracking/TaskCard.vue'
const config = useRuntimeConfig().public
const CLIENT_ID = config.GOOGLE_API_CLIENT_ID
const API_KEY = config.FIREBASE_API_KEY
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar'

const tokenAccess = ref(null)
const tasksStore = useTasksTrackingStore()
onMounted(() => {
  initGoogleApi()
  tasksStore.getTasks()
})

function initGoogleApi () {
  tokenAccess.value = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '' // defined later
  })
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC]
    })
  })
}

function requestCalendarAccess () {
  tokenAccess.value.callback = (resp) => {
    if (resp.error !== undefined) {
      throw (resp)
    }
    tasksStore.setCalendarAccess(true)
  }

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenAccess.value.requestAccessToken({ prompt: 'consent' })
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenAccess.value.requestAccessToken({ prompt: '' })
  }
}
</script>

<template>
  <main class="flex-grow flex flex-col container mx-auto">
    <section class="relative flex-grow px-4">
      <div v-if="!tasksStore.hasCalendarAccess" class="text-center my-3">
        <p class="md:text-xl">
          Realiza seguimiento del tiempo invertido en diferentes tareas
        </p>
        <p>
          Para mejor control, las tareas se registrarán en tu calendario de Google
        </p>
        <button class="btn btn-info mt-4" @click="requestCalendarAccess">
          Acceder al  alendario
        </button>
      </div>
      <div class="flex flex-wrap gap-4">
        <TaskCard
          v-for="task in tasksStore.tasks.data"
          :key="task.id"
          :task="task"
        />
      </div>
      <CreateTask />
    </section>
  </main>
</template>
