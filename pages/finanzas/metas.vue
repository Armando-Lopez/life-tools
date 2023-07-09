<script setup lang="ts">
// import { useFinanceStore } from '~/stores/finance'
import CreateTransaction from '~/components/finance/CreateTransaction.vue'
definePageMeta({ middleware: 'auth' })

// const financeStore = useFinanceStore()
</script>

<template>
  <div class="divider" />
  <CreateTransaction />
</template>
