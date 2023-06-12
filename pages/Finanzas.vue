<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
definePageMeta({ layout: 'finance-layout' })

const financeStore = useFinanceStore()
</script>

<template>
  <section class="px-4">
    <div class="card shadow-xl" @click="financeStore.getBalance()">
      <div class="card-body">
        <p class="card-title">
          Saldo total
        </p>
        <p v-currency="financeStore.totalBalance" class="text-green-600 text-3xl font-semibold italic" />
      </div>
    </div>
  </section>
</template>
