<script setup lang="ts">
import { TRANSACTIONS_PATH } from '~/constants/firebaseConstants'
import { Transaction } from '~/interfaces/finance'
import TransactionItem from '~/components/finance/transactions/TransactionItem.vue'

const { isLoading, getDocs } = useFirestore()
const transactions = ref<Transaction[]>([])

onMounted(async () => {
  const { data } = await getDocs(TRANSACTIONS_PATH)
  if (data) {
    transactions.value = data
  }
})
</script>

<template>
  <section class="pt-4 px-4">
    <AppLoader v-if="isLoading" class="mx-auto" />
    <div v-else class="flex flex-wrap gap-4">
      <TransactionItem v-for="item in transactions" :key="item.id" :transaction="item" />
    </div>
  </section>
  <div class="divider" />
</template>
