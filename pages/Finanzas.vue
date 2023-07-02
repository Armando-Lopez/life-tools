<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import PocketsList from '~/components/finance/PocketsList.vue'
import CreateEditPocket from '~/components/finance/CreateEditPocket.vue'
definePageMeta({ middleware: 'auth' })

const financeStore = useFinanceStore()

onMounted(() => {
  financeStore.getPockets()
})
</script>

<template>
  <section class="px-4">
    <div class="card shadow-md">
      <div class="card-body">
        <h2 class="card-title">
          Saldo total
        </h2>
        <p v-currency.animate="financeStore.totalBalance" class="text-green-600 text-2xl font-semibold" />
        <div class="card-actions justify-end">
        </div>
      </div>
    </div>

    <div class="divider" />
    <CreateEditPocket />
    <PocketsList />
    <div class="divider" />
  </section>
</template>
