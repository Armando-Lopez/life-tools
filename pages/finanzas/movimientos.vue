<script setup lang="ts">
// import { useFinanceStore } from '~/stores/finance'
import CreateTransaction from '~/components/finance/CreateTransaction.vue'
definePageMeta({ middleware: 'auth' })

// const financeStore = useFinanceStore()
</script>

<template>
  <section>
    <div class="flex w-full justify-around">
      <AppIcon icon="mdi:input" :rotate="3" width="50" />
      <AppIcon icon="mdi:output" :rotate="3" width="50" />
    </div>
  </section>
  <div class="divider" />
  <CreateTransaction />
</template>
