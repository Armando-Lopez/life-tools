export default defineNuxtPlugin((to) => {
  addRouteMiddleware('auth', () => {
    const { $auth } = useNuxtApp()
    // @ts-ignore
    if (to.path !== '/' && !$auth.currentUser?.uid) {
      return abortNavigation()
    }
  })
})
