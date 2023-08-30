<script setup lang="ts">
import { useFormField } from '~/composables/useFormField'

const props = defineProps({
  errorMessage: { type: String, default: '' },
  hint: { type: String, default: '' },
  hintTop: { type: Boolean, default: false },
  label: { type: String, default: '' },
  name: { type: String, required: true },
  placeholder: { type: String, default: '' },
  rules: { type: [String, Object], default: '' },
  type: { type: String, default: 'text' }
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
        <span v-else>(opcional)</span>
      </span>
    </label>
    <span v-if="props.hintTop" class="empty:hidden block mb-2 opacity-80 text-sm">
      <slot name="hint">
        {{ props.hint }}
      </slot>
    </span>
    <input
      :id="props.name"
      v-bind="formContext.inputsBindings[props.name]"
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      class="input input-bordered input-primary w-full"
      :class="{ 'input-error': !!error }"
    >
    <span v-if="!props.hintTop" class="empty:hidden block mt-2 opacity-80 text-sm">
      <slot name="hint">
        {{ props.hint }}
      </slot>
    </span>
    <label :for="props.name" class="label">
      <span class="label-text-alt text-error">{{ error || props.errorMessage }}</span>
    </label>
  </div>
</template>
