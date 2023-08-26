import { configure, defineRule } from 'vee-validate'
// eslint-disable-next-line camelcase
import { required, numeric, max_value, min_value, max, regex } from '@vee-validate/rules'

export default defineNuxtPlugin(() => {
  const customMessages = {
    max: (context) => {
      const [maxValue] = context.rule.params
      return Number(maxValue) >= context.value.length || `Máximo ${maxValue} caracteres`
    },
    min_value: (context) => {
      const [paramValue, paramMask] = context.rule.params
      const param = Number(paramValue)
      return param <= context.value || `Ingresa minímo ${paramMask}`
    },
    max_value: (context) => {
      const [paramValue, paramMask] = context.rule.params
      const param = Number(paramValue)
      return param >= context.value || `Ingresa máximo ${paramMask}`
    },
    numeric: () => 'Sólo números',
    required: () => 'Requerido',
    regex: () => 'Formato no válido'
  }
  defineRule('max', max)
  defineRule('max_value', max_value)
  defineRule('min_value', min_value)
  defineRule('numeric', numeric)
  defineRule('required', required)
  defineRule('regex', regex)

  configure({
    generateMessage: context => customMessages[context.rule.name](context)
  })
})
