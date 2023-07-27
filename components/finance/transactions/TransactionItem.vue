<script setup lang="ts">
import { Transaction } from '~/interfaces/finance'
import { TRANSACTIONS_TYPES } from '~/constants/firebaseConstants'

const props = defineProps<{ transaction: Transaction }>()
const { currency } = useFilter()
</script>

<template>
  <div class="base-card">
    <div class="card-body p-1">
      <div class="flex justify-between items-center">
        <strong class="text-xl">{{ currency(props.transaction.amount) }}</strong>
        <AppIcon
          v-if="props.transaction.type === TRANSACTIONS_TYPES.INPUT"
          icon="mdi:input"
          :rotate="1"
          width="25"
          class="text-green-400"
        />
        <AppIcon
          v-if="props.transaction.type === TRANSACTIONS_TYPES.OUTPUT"
          icon="mdi:output"
          :rotate="3"
          width="25"
          class="text-red-400"
        />
      </div>
      <p>Motivo: {{ props.transaction.description }}</p>
      <p>Fecha: {{ props.transaction.created }}</p>
    </div>
  </div>
</template>
