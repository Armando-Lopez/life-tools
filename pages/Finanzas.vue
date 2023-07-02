<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import AccountsList from '~/components/finance/AccountsList.vue'
import CreateAccount from '~/components/finance/CreateAccount.vue'
definePageMeta({ middleware: 'auth' })

const financeStore = useFinanceStore()

onMounted(() => {
  financeStore.getAccounts()
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
          <CreateAccount />
        </div>
      </div>
    </div>

    <div class="divider" />
    <AccountsList />
    <div class="divider" />
  </section>
</template>
