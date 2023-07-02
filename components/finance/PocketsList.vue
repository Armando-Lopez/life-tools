<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import PocketInfo from '~/components/finance/PocketInfo.vue'

const financeStore = useFinanceStore()

</script>

<template>
  <article>
    <div class="flex items-center gap-5 mb-4">
      <p class="text-2xl font-semibold">
        Bolsillos
      </p>
      <button class="btn btn-success btn-circle btn-sm" @click="financeStore.showPocketModal = true">
        <AppIcon icon="ic:round-plus" width="30px" />
      </button>
    </div>
    <AppLoader v-if="financeStore.pockets.isLoading" />
    <div v-else-if="financeStore.pockets.data.length" class="flex flex-wrap gap-5">
      <PocketInfo
        v-for="pocket in financeStore.pockets.data"
        :key="pocket.id"
        :pocket="pocket"
      />
    </div>
    <div v-else>
      <p>¡UPS! Tus pantalones estás vacíos</p>
      <p class="mb-2">
        Usa el botón para crear un bosillo y comienza el seguimiento de tus finanzas
      </p>
    </div>
  </article>
</template>
