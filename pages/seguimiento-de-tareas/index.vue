<script setup>
const config = useRuntimeConfig().public
const CLIENT_ID = config.GOOGLE_API_CLIENT_ID
const API_KEY = config.FIREBASE_API_KEY
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar'

const hasCalendarAccess = ref(false)
const tokenAccess = ref(null)

onMounted(initGoogleApi)

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
    hasCalendarAccess.value = true
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

async function listUpcomingEvents () {
  let response
  try {
    const request = {
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    }
    response = await gapi.client.calendar.events.list(request)
  } catch (err) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const events = response.result.items
  // console.log(events)
}

/**
 *  Sign out the user upon button click.
 */
// function handleSignoutClick () {
//   const token = gapi.client.getToken()
//   if (token !== null) {
//     google.accounts.oauth2.revoke(token.access_token)
//     gapi.client.setToken('')
//     document.getElementById('content').innerText = ''
//     document.getElementById('authorize_button').innerText = 'Authorize'
//     document.getElementById('signout_button').style.visibility = 'hidden'
//   }
// }
</script>

<template>
  <section>
    <div class="text-center mt-3">
      <template v-if="!hasCalendarAccess">
        <p class="md:text-xl">
          Realiza seguimiento del tiempo invertido en diferentes tareas
        </p>
        <p>
          Para mejor control, las tareas se registrarán en tu calendario de Google
        </p>
        <button class="btn btn-info mt-4" @click="requestCalendarAccess">
          Acceder al  alendario
        </button>
      </template>
      <template v-else>
        <button @click="listUpcomingEvents">
          test
        </button>
      </template>
    </div>
  </section>
</template>
