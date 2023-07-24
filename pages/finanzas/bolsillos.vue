<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import PocketsList from '~/components/finance/pockets/PocketsList.vue'
import PocketCreateEdit from '~/components/finance/pockets/PocketCreateEdit.vue'
import RegisterTransaction from '~/components/finance/transactions/RegisterTransaction.vue'
import { TRANSACTIONS_TYPES } from '~/constants/firebaseConstants'

const financeStore = useFinanceStore()
const { currency } = useFilter()

const fab = ref(false)

function onTransactionRegister () {
  fab.value = false
  financeStore.getPockets()
}
</script>

<template>
  <section class="relative px-4 pt-4">
    <div class="base-card">
      <div class="card-body">
        <h2 class="card-title">
          Saldo total
        </h2>
        <p class="text-green-600 text-2xl font-semibold">
          {{ currency(financeStore.totalBalance) }}
        </p>
        <div class="card-actions justify-end" />
      </div>
    </div>
  </section>
  <AppFabButton v-model="fab">
    <PocketCreateEdit />
    <RegisterTransaction
      :type="TRANSACTIONS_TYPES.INPUT"
      button-class="btn-success"
      @success="onTransactionRegister"
    />
    <RegisterTransaction
      :type="TRANSACTIONS_TYPES.OUTPUT"
      button-class="btn-error"
      @success="onTransactionRegister"
    />
  </AppFabButton>
  <div class="divider" />
  <PocketsList />
</template>
