<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import GoalCreate from '~/components/finance/goals/GoalCreate.vue'
import GoalCard from '~/components/finance/goals/GoalCard.vue'

const financeStore = useFinanceStore()
onMounted(() => {
  financeStore.getGoals()
})
</script>

<template>
  <section class="relative pt-4 px-4">
    <template v-if="!financeStore.goals.data.length">
      <AppIcon icon="octicon:goal-16" width="60" class="mx-auto text-red-500" />
      <p class="text-lg text-center italic">
        ¿Estás invirtiendo?
      </p>
      <p class="text-center">
        Registra aquí el avance de tus inversiones
      </p>
    </template>
    <div v-else class="flex flex-wrap gap-5">
      <GoalCard
        v-for="goal in financeStore.goals.data"
        :key="goal.id"
        :goal="goal"
      />
    </div>
  </section>
  <div class="divider" />
  <GoalCreate />
</template>
