<script setup lang="ts">
import { useForm } from 'vee-validate'
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false },
  initialValues: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue', 'success', 'error'])
const validationSchema = reactive<any>({})
const inputsBindings = reactive<any>({})

const {
  values, errors, handleSubmit, isSubmitting, isValidating,
  defineInputBinds, setValues, setFieldValue, resetForm
} = useForm({
  initialValues: props.modelValue,
  validationSchema
})
const onSubmit = handleSubmit((values) => {
  if (!props.isLoading || !isSubmitting || !isValidating) {
    emit('success', values)
  }
}, (values) => {
  if (!props.isLoading || !isSubmitting || !isValidating) {
    emit('error', values)
  }
})
function registerInput (name: string) {
  inputsBindings[name] = defineInputBinds(name)
}
function setRules (rule: any) {
  validationSchema[rule.inputName] = rule.rules
}

watch(props.modelValue, (newValue) => {
  setValues(newValue)
}, { immediate: true, deep: true })
watch(values, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

defineExpose({ setValues, setFieldValue, resetForm })
provide('appForm', { errors, inputsBindings, registerInput, setRules })
</script>

<template>
  <form @submit.prevent="onSubmit">
    <slot />
  </form>
</template>
