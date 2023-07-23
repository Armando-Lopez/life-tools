<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import PocketsList from '~/components/finance/pockets/PocketsList.vue'
import PocketCreateEdit from '~/components/finance/pockets/PocketCreateEdit.vue'

const financeStore = useFinanceStore()
const { currency } = useFilter()
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
  <div class="divider" />
  <PocketsList />
  <PocketCreateEdit />
</template>
