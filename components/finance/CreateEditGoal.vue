<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useFinanceStore } from '~/stores/finance'

const financeStore = useFinanceStore()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isEditing = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { defineInputBinds, errors, handleSubmit, setValues, resetForm } = useForm({
  validationSchema: {
    name: 'required|max:100',
    description: 'max:500',
    currentAmount: 'numeric',
    finalAmount: 'required|min_value:100,$100'
  }
})
const name = defineInputBinds('name')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const description = defineInputBinds('description')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const currentAmount = defineInputBinds('currentAmount')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const finalAmount = defineInputBinds('finalAmount')

const saveGoal = handleSubmit(() => {

})
const showModal = ref(false)
</script>

<template>
  <AppModal v-model="showModal">
    <form autocomplete="off" @submit.prevent="saveGoal">
      <p class="mb-5 font-semibold text-center text-2xl">
        {{ financeStore.pocketToEdit.data.id ? "Editar" : "Agregar" }} meta
      </p>
      <div>
        <label for="pocket-name" class="label">
          <span class="label-text">¿Dónde se encuentra el dinero?</span>
        </label>
        <input
          id="pocket-name"
          v-bind="name"
          name="pocketName"
          type="text"
          placeholder="Banco/Ahorros/Efectivo"
          class="input input-bordered input-primary w-full"
          :class="{ 'input-error': !!errors.name }"
        >
        <label for="pocket-name" class="label">
          <span class="label-text-alt text-error">{{ errors.name }}</span>
        </label>
      </div>
      <button
        :disabled="financeStore.pockets.isCreating || financeStore.pocketToEdit.isSaving"
        class="btn btn-block btn-success mt-4"
      >
        <AppLoader v-if="financeStore.pockets.isCreating || financeStore.pocketToEdit.isSaving" />
        <span v-else>{{ financeStore.pocketToEdit.data.id ? 'Editar' : 'Crear' }}</span>
      </button>
    </form>
  </AppModal>
</template>
