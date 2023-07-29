<script setup lang="ts">
import { Transaction } from '~/interfaces/finance'
import { TRANSACTIONS_TYPES } from '~/constants/firebaseConstants'
import { useFinanceStore } from '~/stores/finance'
const financeStore = useFinanceStore()
const { formatTime } = useTime()
const { currency } = useFilter()
const props = defineProps<{ transaction: Transaction }>()
const pocketName = computed(() => financeStore.pockets.data.find(p => p.id === props.transaction.pocketId)?.name)
</script>

<template>
  <AppCard>
    <AppAccordion>
      <template #header>
        <div class="flex gap-1 justify-between items-center">
          <strong
            class="text-xl"
            :class="{
              'text-green-500': props.transaction.type === TRANSACTIONS_TYPES.INPUT,
              'text-red-500': props.transaction.type === TRANSACTIONS_TYPES.OUTPUT
            }"
          >
            {{ currency(props.transaction.amount) }}
          </strong>
        </div>
      </template>
      <div>
        <p>Fecha: {{ formatTime(props.transaction.created, 'dddd, D [de] MMMM YYYY, h:mm A') }}</p>
        <p v-if="pocketName">
          Bolsillo: {{ pocketName }}
        </p>
        <p>Motivo: {{ props.transaction.description }}</p>
      </div>
    </AppAccordion>
  </AppCard>
</template>
