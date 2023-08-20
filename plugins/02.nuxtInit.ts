import { Auth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '~/stores/user'
import { User } from '~/interfaces'

export default defineNuxtPlugin(() => {
  // nuxtApp.hook('app:', () => {
  const router = useRouter()
  const userStore = useUserStore()
  const { $auth } = useNuxtApp()
  onAuthStateChanged(<Auth>$auth, (currentUser) => {
    setTimeout(() => {
      if (currentUser) {
        userStore.setUser(currentUser as User)
      } else {
        userStore.setUser(null)
        router.push('/')
      }
    }, 1000)
  })
  // })
})
