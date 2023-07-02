<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import CreateAccount from '~/components/finance/CreateAccount.vue'

const financeStore = useFinanceStore()

</script>

<template>
  <article>
    <p class="mb-3 text-xl font-semibold">
      Cuentas
    </p>
    <div class="flex gap-3">
      <template v-if="financeStore.accounts.isLoading">
        <span class="loading loading-dots loading-lg mx-auto text-secondary" />
      </template>
      <template v-else-if="financeStore.accounts.data.length">
        <div
          v-for="account in financeStore.accounts.data"
          :key="account.id"
          class="card relative w-fit shadow"
        >
          <button>
            <AppIcon icon="pepicons-pop:dots-y" class="absolute right-2 top-2" />
          </button>
          <div class="card-body">
            <p class="card-title">
              {{ account.name }}
            </p>
            <p v-currency="account.amount" class="text-green-600 text-xl" />
          </div>
        </div>
      </template>
      <div v-else>
        <p>No tienes ninguna cuenta asociada</p>
        <p class="mb-2">
          ¡Crear una cuenta y comienza a mantener el orden en tus finanzas!
        </p>
        <CreateAccount />
      </div>
    </div>
  </article>
</template>
