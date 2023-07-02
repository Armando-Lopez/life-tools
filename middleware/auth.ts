export default defineNuxtPlugin((to) => {
  addRouteMiddleware('auth', () => {
    const { $auth } = useNuxtApp()
    if (to.path !== '/' && !$auth.currentUser?.uid) {
      return abortNavigation()
    }
  })
})
