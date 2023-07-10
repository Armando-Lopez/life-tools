<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
  rules: { type: String, default: '' }
})

const formContext = inject('appForm')
onMounted(() => {
  // @ts-ignore
  formContext.registerInput(props.name as string)
})
watch(() => props.rules, (newValue) => {
  if (newValue) {
    // @ts-ignore
    formContext.setRules({
      inputName: props.name,
      rules: props.rules
    })
  }
}, { immediate: true })

const error = ref('')
// @ts-ignore
watch(formContext.errors, value => (error.value = value[props.name]))
</script>

<template>
  <div>
    <label v-if="props.label" :for="props.name" class="label">
      <span class="label-text">{{ props.label }}</span>
    </label>
    <textarea
      :id="props.name"
      v-bind="formContext.inputsBindings[props.name]"
      :name="props.name"
      :placeholder="props.placeholder"
      class="textarea textarea-primary h-24 w-full"
      :class="{ 'input-error': !!error }"
    />
    <label :for="props.name" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
