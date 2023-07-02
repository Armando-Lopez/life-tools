<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useFinanceStore } from '~/stores/finance'

const financeStore = useFinanceStore()

const isEditing = ref(false)

const { defineInputBinds, errors, handleSubmit, setValues, resetForm } = useForm({
  validationSchema: {
    pocketAmount: 'required|numeric|min_value:100,$100',
    pocketName: 'required'
  }
})
const pocketAmount = defineInputBinds('pocketAmount')
const pocketName = defineInputBinds('pocketName')

const savePocket = handleSubmit(async (values) => {
  const pocketData = {
    name: values.pocketName,
    amount: values.pocketAmount
  }
  if (isEditing.value) {
    const hasDeleted = await financeStore.deletePocket(financeStore.pocketToEdit.data.path || null)
    if (hasDeleted) {
      await financeStore.cratePocket(pocketData)
    }
  } else {
    await financeStore.cratePocket(pocketData)
  }
  financeStore.showPocketModal = false
  await financeStore.getPockets()
})

watch(financeStore.pocketToEdit, (newValue) => {
  isEditing.value = !!newValue.data.id
  if (isEditing.value) {
    setValues({
      pocketName: newValue.data.name,
      pocketAmount: newValue.data.amount
    })
  } else {
    resetForm()
  }
})
</script>

<template>
  <AppModal v-model="financeStore.showPocketModal">
    <form autocomplete="off" @submit.prevent="savePocket">
      <p class="mb-5 font-semibold text-center text-2xl">
        {{ financeStore.pocketToEdit.data.id ? "Editar" : "Agregar" }} bolsillo
      </p>
      <div>
        <label for="pocket-name" class="label">
          <span class="label-text">¿Dónde se encuentra el dinero?</span>
        </label>
        <input
          id="pocket-name"
          v-bind="pocketName"
          name="pocketName"
          type="text"
          placeholder="Banco/Ahorros/Efectivo"
          class="input input-bordered input-primary w-full"
          :class="{ 'input-error': !!errors.pocketName }"
        >
        <label for="pocket-name" class="label">
          <span class="label-text-alt text-error">{{ errors.pocketName }}</span>
        </label>
      </div>
      <div>
        <label for="pocket-amount" class="label">
          <span class="label-text">¿Cuánto dinero tienes en el bolsillo?</span>
        </label>
        <input
          id="pocket-amount"
          v-bind="pocketAmount"
          name="pocketAmount"
          type="number"
          placeholder="$ 1.000.000"
          class="input input-bordered input-primary w-full"
          :class="{ 'input-error': !!errors.pocketAmount }"
        >
        <strong v-currency="pocketAmount.value" />
        <label for="pocket-amount" class="label">
          <span class="label-text-alt text-error">{{ errors.pocketAmount }}</span>
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
