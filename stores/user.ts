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

  const googleAuthToken = ref<any>(null)

  function setUser (currentUser: User | null) {
    user.uid = currentUser?.uid || null
    user.email = currentUser?.email || null
    user.displayName = currentUser?.displayName || null
    user.photoURL = currentUser?.photoURL || null
    hasLoadedAuth.value = true
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

  function setGoogleAuthToken (token: any) {
    googleAuthToken.value = token
  }

  return {
    hasLoadedAuth,
    setUser,
    signIn,
    user,
    googleAuthToken,
    setGoogleAuthToken
  }
})
