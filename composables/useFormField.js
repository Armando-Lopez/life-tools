export const useFormField = ({ name, rules }) => {
  const formContext = inject('appForm')
  onMounted(() => {
    // @ts-ignore
    formContext.registerInput(name)
  })
  watch(() => rules, (newValue) => {
    if (newValue) {
      // @ts-ignore
      formContext.setRules({
        inputName: name,
        rules
      })
    }
  }, { immediate: true })

  const error = ref('')
  // @ts-ignore
  watch(formContext.errors, value => (error.value = value[name]))

  return {
    error,
    formContext
  }
}
