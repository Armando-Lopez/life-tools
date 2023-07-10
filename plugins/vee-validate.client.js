import { configure, defineRule } from 'vee-validate'
// eslint-disable-next-line camelcase
import { required, numeric, min_value, max } from '@vee-validate/rules'

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
  numeric: () => 'Sólo números',
  required: () => 'Requerido'
}

export default defineNuxtPlugin(() => {
  defineRule('max', max)
  defineRule('min_value', min_value)
  defineRule('numeric', numeric)
  defineRule('required', required)

  configure({
    generateMessage: context => customMessages[context.rule.name](context)
  })
})
