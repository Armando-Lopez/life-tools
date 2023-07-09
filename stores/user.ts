import { defineStore } from 'pinia'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { User } from '~/interfaces'

export const useUserStore = defineStore('userStore', () => {
  const hasLoadedAuth = ref(false)

  const user = reactive<User>({
    uid: null,
    email: null,
    displayName: null,
    photoURL: null
  })

  const authTokenAccess = ref({})

  function setUser (currentUser: User | null) {
    user.uid = currentUser?.uid || null
    user.email = currentUser?.email || null
    user.displayName = currentUser?.displayName || null
    user.photoURL = currentUser?.photoURL || null
    hasLoadedAuth.value = true
  }

  async function initGoogleApi () {
    const config = useRuntimeConfig().public
    const CLIENT_ID = config.GOOGLE_API_CLIENT_ID
    const API_KEY = config.FIREBASE_API_KEY
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
    const SCOPES = 'https://www.googleapis.com/auth/calendar'
    // @ts-ignore
    await window.gapi.load('client', async () => {
      // @ts-ignore
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC]
      })
      // @ts-ignore
      authTokenAccess.value = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '' // defined later
      })
    })
  }

  function signIn () {
    const { $auth } = useNuxtApp()
    const provider = new GoogleAuthProvider()
    // provider.addScope('https://www.googleapis.com/auth/calendar')
    signInWithPopup($auth, provider)
    // .then((result) => {
    //   // setUser(<User>result.user)
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   // const credential = GoogleAuthProvider.credentialFromResult(result)
    //   // const token = credential.accessToken
    //   // The signed-in user info.
    //   // IdP data available using getAdditionalUserInfo(result)
    // }).catch(() => {
    //   // Handle Errors here.
    //   //   const errorCode = error.code
    //   //   const errorMessage = error.message
    //   //   The email of the user's account used.
    //   // const email = error.customData.email
    //   // The AuthCredential type that was used.
    //   // const credential = GoogleAuthProvider.credentialFromError(error)
    // })
  }

  return {
    authTokenAccess,
    hasLoadedAuth,
    initGoogleApi,
    setUser,
    signIn,
    user
  }
})
