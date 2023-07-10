<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import { Pocket } from '~/interfaces/finance'

const financeStore = useFinanceStore()
const isEditing = ref(false)
const formRef = ref(null)
const model = ref<Pocket>({
  name: '',
  amount: 0
})

async function savePocket () {
  if (isEditing.value) {
    await financeStore.updatePocket(financeStore.pocketToEdit.data.path, model.value)
  } else {
    await financeStore.cratePocket(model.value)
  }
  financeStore.showPocketModal = false
  await financeStore.getPockets()
}

watch(financeStore.pocketToEdit, (newValue) => {
  isEditing.value = !!newValue.data.id
  if (isEditing.value) {
    formRef.value.setValues({
      name: newValue.data.name,
      amount: newValue.data.amount
    })
  } else {
    formRef.value.resetForm()
  }
})
</script>

<template>
  <button
    class="absolute bottom-1 right-2 btn bg-[#8c630b] btn-circle"
    @click="financeStore.showPocketModal = true"
  >
    <AppIcon icon="ic:round-plus" width="30px" class="text-white" />
  </button>
  <AppModal v-model="financeStore.showPocketModal">
    <AppForm
      ref="formRef"
      v-model="model"
      autocomplete="off"
      :is-loading="financeStore.pockets.isCreating || financeStore.pocketToEdit.isSaving"
      @success="savePocket"
    >
      <p class="mb-5 font-semibold text-center text-2xl">
        {{ financeStore.pocketToEdit.data.id ? "Editar" : "Agregar" }} bolsillo
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
        placeholder="$100.000.000"
        rules="required|numeric|min_value:100,$100"
        type="number"
      />
      <button class="btn btn-block btn-success mt-4">
        <span>Guardar</span>
      </button>
    </AppForm>
  </AppModal>
</template>
