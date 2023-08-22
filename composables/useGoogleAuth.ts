export const useGoogleAuth = () => {
  const config = useRuntimeConfig().public
  const CLIENT_ID = config.GOOGLE_API_CLIENT_ID
  const API_KEY = config.FIREBASE_API_KEY
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
  const SCOPES = 'https://www.googleapis.com/auth/calendar'

  const googleAuth = ref<any>(null)

  onMounted(() => {
    // @ts-ignore
    gapi.load('client', () => {
      // @ts-ignore
      gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC]
      })
    })
  })
  function initGoogleAuth (cb: Function = () => ({})) {
    // @ts-ignore
    googleAuth.value = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback (response: any) {
        cb?.(response)
      }
    })
  }

  function requestAccess (cb: Function = () => ({})) {
    // @ts-ignore
    googleAuth.value = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback (response: any) {
        cb?.(response)
      }
    })
    // @ts-ignore
    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      googleAuth.value.requestAccessToken({ prompt: 'consent' })
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      googleAuth.value.requestAccessToken({ prompt: '' })
    }
  }

  return {
    googleAuth,
    initGoogleAuth,
    requestAccess
  }
}
