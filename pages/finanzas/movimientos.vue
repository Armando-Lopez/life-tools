<script setup lang="ts">
import { TRANSACTIONS_PATH } from '~/constants/firebaseConstants'
import { Transaction } from '~/interfaces/finance'
import TransactionItem from '~/components/finance/transactions/TransactionItem.vue'

const { getDocs } = useFirestore()
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
    <ul>
      <li v-for="item in transactions" :key="item.id">
        <TransactionItem :transaction="item" />
      </li>
    </ul>
  </section>
  <div class="divider" />
</template>
