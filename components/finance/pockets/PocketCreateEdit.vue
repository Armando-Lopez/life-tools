<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import { Pocket } from '~/interfaces/finance'
import { POCKETS_PATH } from '~/constants/firebaseConstants'

const financeStore = useFinanceStore()
const { isLoading, createDoc, updateDoc } = useFirestore()
const { currency } = useFilter()

const isEditing = ref(false)
const formRef = ref(null)
const model = ref<Pocket>({
  name: '',
  amount: 0
})

async function savePocket () {
  if (isEditing.value) {
    await updateDoc(financeStore.pocketToEdit.data.path, model.value)
  } else {
    await createDoc(POCKETS_PATH, model.value)
  }
  financeStore.showPocketModal = false
  await financeStore.getPockets()
}

watch(financeStore.pocketToEdit, (newValue) => {
  isEditing.value = !!newValue.data.id
  if (isEditing.value) {
    // @ts-ignore
    formRef.value.setValues({
      name: newValue.data.name,
      amount: newValue.data.amount
    })
  } else {
    // @ts-ignore
    formRef.value.resetForm()
  }
})
</script>

<template>
  <button
    class="btn btn-secondary btn-circle"
    title="Crear bolsillo"
    @click="financeStore.showPocketModal = true"
  >
    <AppIcon icon="mdi:pencil-plus" width="20px" class="text-white" />
  </button>
  <AppModal v-model="financeStore.showPocketModal">
    <AppForm
      ref="formRef"
      v-model="model"
      autocomplete="off"
      :is-loading="isLoading"
      @success="savePocket"
    >
      <p class="mb-5 font-semibold text-center text-2xl">
        {{ financeStore.pocketToEdit.data.id ? "Editar" : "Crear" }} bolsillo
      </p>
      <AppTextField
        label="¿Dónde se encuentra el dinero?"
        name="name"
        placeholder="Banco/Ahorros/Efectivo"
        rules="required"
        type="text"
      />
      <AppTextField
        label="¿Cuánto dinero tienes en el bolsillo?"
        name="amount"
        placeholder="$1.000.000"
        rules="required|min_value:1,$1"
        type="number"
      />
      <strong>{{ currency(model.amount) }}</strong>
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
      </button>
    </AppForm>
  </AppModal>
</template>
