<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import { Pocket, Transaction } from '~/interfaces/finance'
import {
  POCKETS_PATH,

  FINANCE_PATH,
  TRANSACTIONS_PATH,
  TRANSACTIONS_TYPES
} from '~/constants/firebaseConstants'

const props = defineProps({
  buttonClass: { type: String, default: '' },
  type: { type: String, required: true }
})
const emit = defineEmits(['success'])

const typeHelp = {
  [TRANSACTIONS_TYPES.INPUT]: {
    title: 'Registrar entrada',
    amountLabel: '¿Cuánto guardarás?',
    icon: 'mdi:input',
    iconRotate: '1',
    pocketLabel: '¿En cuál bolsillo lo guardarás?'
  },
  [TRANSACTIONS_TYPES.OUTPUT]: {
    title: 'Registrar salida',
    amountLabel: '¿Cuánto sacarás?',
    icon: 'mdi:output',
    iconRotate: '3',
    pocketLabel: '¿De cuál bolsillo sale?'
  }
}[props.type]

const financeStore = useFinanceStore()

const { isLoading, getDoc, updateDoc, createDoc, createDocOrUpdateIfExists, addToArray } = useFirestore()
const { currency } = useFilter()

const modal = ref(false)
const model = ref<Transaction>({
  amount: 0,
  description: '',
  pocketId: '',
  type: props.type
})

const pockets = computed(() => financeStore.pockets.data)
const pocket = computed(() => pockets.value.find(p => p.id === model.value.pocketId))

const rules = computed(() => ({
  [TRANSACTIONS_TYPES.INPUT]: {
    amount: 'required|numeric|min_value:100,$100'
  },
  [TRANSACTIONS_TYPES.OUTPUT]: {
    amount: `required|numeric|min_value:100,$100|max_value:${pocket.value?.amount},${currency(pocket.value?.amount)}`
  }
}[props.type]))

async function processAmount () {
  const { data: pocket, error } = await getDoc(`${POCKETS_PATH}/${model.value.pocketId}`)
  if (error) { return }
  let amount = pocket.amount
  if (props.type === TRANSACTIONS_TYPES.INPUT) {
    amount += model.value.amount
  }
  if (props.type === TRANSACTIONS_TYPES.OUTPUT) {
    amount -= model.value.amount
  }
  await updatePocket({ amount })
}

async function updatePocket (newData: Pocket) {
  const { error } = await updateDoc(`${POCKETS_PATH}/${model.value.pocketId}`, newData)
  if (error) { return }
  await createTransaction()
}

async function createTransaction () {
  const { error } = await createDoc(TRANSACTIONS_PATH, model.value)
  if (!error) {
    emit('success')
    modal.value = false
    await saveDescription()
  }
}

async function saveDescription () {
  if (model.value.description) {
    await createDocOrUpdateIfExists(FINANCE_PATH, {
      transaction_descriptions: { [props.type]: addToArray(model.value.description) }
    })
  }
}
</script>

<template>
  <button
    class="btn btn-circle"
    :class="props.buttonClass"
    :title="typeHelp.title"
    @click="modal = true"
  >
    <AppIcon :icon="typeHelp.icon" :rotate="typeHelp.iconRotate" width="20px" class="text-white" />
  </button>
  <AppModal v-model="modal">
    <template v-if="!pockets.length">
      <p class="mb-2">
        Aún tienes bolsillos. primero crea con el botón
        <button
          class="btn btn-secondary btn-circle btn-sm"
          title="Crear bolsillo"
          @click="financeStore.showPocketModal = true"
        >
          <AppIcon icon="mdi:pencil-add" width="20px" class="text-white" />
        </button>
        desde el menú de acciónes
      </p>
    </template>
    <AppForm
      v-else
      v-model="model"
      :is-loading="isLoading"
      autocomplete="off"
      @success="processAmount"
    >
      <p class="mb-5 font-semibold text-center text-2xl">
        {{ typeHelp.title }}
      </p>
      <AppSelect
        :items="pockets"
        :label="typeHelp.pocketLabel"
        name="pocketId"
        placeholder="Banco"
        rules="required"
      />
      <template v-if="model.pocketId">
        <AppTextField
          :label="typeHelp.amountLabel"
          name="amount"
          placeholder="$100.000"
          :rules="rules.amount"
          type="number"
        />
        <strong>{{ currency(model.amount) }}</strong>
        <AppTextField
          name="description"
          label="Motivo (opcional)"
          rules="required|max:200"
        />
        <button class="btn btn-block btn-success mt-4">
          <span>Guardar</span>
        </button>
      </template>
    </AppForm>
  </AppModal>
</template>
