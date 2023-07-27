<script setup lang="ts">
import { useFormField } from '~/composables/useFormField'

const props = defineProps({
  name: { type: String, required: true },
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
  rules: { type: String, default: '' }
})

const { formContext, error, isRequired } = useFormField({
  name: props.name,
  rules: props.rules
})
</script>

<template>
  <div>
    <label v-if="props.label" :for="props.name" class="label">
      <span class="label-text" :class="{ 'text-error': !!error }">
        {{ props.label }}
        <strong v-if="isRequired" class="text-info text-lg">*</strong>
      </span>
    </label>
    <textarea
      :id="props.name"
      :class="{ 'textarea-error': !!error }"
      :name="props.name"
      :placeholder="props.placeholder"
      class="textarea textarea-primary h-24 w-full"
      v-bind="formContext.inputsBindings[props.name]"
    />
    <label :for="props.name" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
