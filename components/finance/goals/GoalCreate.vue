<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import { Goal } from '~/interfaces/finance'

const financeStore = useFinanceStore()
const { currency } = useFilter()

const modal = ref(false)
const formRef = ref(null)
const model = ref<Goal>({
  id: '',
  name: '',
  finalAmount: null,
  currentAmount: null,
  description: '',
  created: ''
})

async function saveGoal () {
  const hasSaved = await financeStore.createGoal(model.value)
  if (hasSaved) {
    modal.value = false
  }
}
</script>

<template>
  <button
    class="fixed bottom-16 right-2 btn bg-red-500 hover:bg-red-600 btn-circle"
    @click="modal = true"
  >
    <AppIcon icon="ic:round-plus" width="30px" color="white" />
  </button>
  <AppModal v-model="modal">
    <AppForm
      ref="formRef"
      v-model="model"
      autocomplete="off"
      :is-loading="financeStore.goals.isCreating"
      @success="saveGoal"
    >
      <p class="mb-5 font-semibold text-center text-2xl">
        Crear inversión
      </p>
      <AppTextField
        label="Nombre"
        name="name"
        placeholder="Couta nevera"
        rules="required"
        type="text"
      />
      <AppTextArea
        name="description"
        label="Descripción (opcional)"
      />
      <AppTextField
        label="Meta de la inversión"
        name="finalAmount"
        rules="required|numeric|min_value:100000,$100.000"
        placeholder="$10.000.000"
        type="number"
      />
      <strong>{{ currency(model.finalAmount) }}</strong>
      <AppTextField
        label="¿Cuánto has invertido hasta ahora?"
        name="currentAmount"
        placeholder="$2.000.000"
        type="number"
      />
      <strong>{{ currency(model.currentAmount) }}</strong>
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
      </button>
    </AppForm>
  </AppModal>
</template>
