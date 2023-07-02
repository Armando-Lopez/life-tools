<script setup lang="ts">
import { useForm } from 'vee-validate'
import { normalizeString } from '~/helpers/transforms'
import { useFinanceStore } from '~/stores/finance'

const financeStore = useFinanceStore()

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: {
    accountAmount: 'required|numeric|min_value:100,$100',
    accountName: 'required'
  }
})
const accountAmount = defineInputBinds('accountAmount')
const accountName = defineInputBinds('accountName')

const saveAccount = handleSubmit(async (values) => {
  await financeStore.crateAccount({
    id: normalizeString(values.accountName, ['toLowerCase', 'replaceAll| |_']),
    name: values.accountName,
    amount: values.accountAmount
  })
  addAccountModal.value = false
  await financeStore.getAccounts()
})

const addAccountModal = ref(false)
</script>

<template>
  <button class="btn btn-primary btn-square" @click="addAccountModal = true">
    <AppIcon icon="ic:round-plus" width="30px" />
  </button>
  <AppModal v-model="addAccountModal">
    <form autocomplete="off" @submit.prevent="saveAccount">
      <p class="mb-5 font-semibold text-center text-2xl">Agrega una cuenta</p>
      <div>
        <label for="account-name" class="label">
          <span class="label-text">Nombre de la cuenta</span>
        </label>
        <input
          id="account-name"
          v-bind="accountName"
          name="accountName"
          type="text"
          placeholder="Banco/Ahorros"
          class="input input-bordered input-primary w-full"
          :class="{ 'input-error': !!errors.accountName }"
        >
        <label for="account-name" class="label">
          <span class="label-text-alt text-error">{{ errors.accountName }}</span>
        </label>
      </div>
      <div>
        <label for="account-amount" class="label">
          <span class="label-text">¿Cuánto dinero tienes en la cuenta?</span>
        </label>
        <input
          id="account-amount"
          v-bind="accountAmount"
          name="accountAmount"
          type="number"
          placeholder="$ 1.000.000"
          class="input input-bordered input-primary w-full"
          :class="{ 'input-error': !!errors.accountAmount }"
        >
        <p v-currency="accountAmount.value" />
        <label for="account-amount" class="label">
          <span class="label-text-alt text-error">{{ errors.accountAmount }}</span>
        </label>
      </div>
      <button class="btn btn-block btn-success mt-4">
        Crear
      </button>
    </form>
  </AppModal>
</template>
