import dayjs from 'dayjs'
import 'dayjs/locale/es'
import duration from 'dayjs/plugin/duration'
import { Auth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '~/stores/user'
import { User } from '~/interfaces'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    // document.documentElement.setAttribute('data-theme', 'light')
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
  })
  dayjs.extend(duration)
  dayjs.locale('es')
})
