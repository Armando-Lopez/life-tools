<script setup lang="ts">
import { Goal } from '~/interfaces/finance'
import { animationFrame } from '~/helpers/animationFrame'

const props = defineProps<{ goal: Goal }>()

const { currency } = useFilter()

const goalProgress = ref<number>(0)

onMounted(() => {
  animationFrame((progress: number) => {
    goalProgress.value = (props.goal.currentAmount || 0) / props.goal.finalAmount * 100
    goalProgress.value = Math.floor(goalProgress.value * progress)
  }, 1000)
})

</script>

<template>
  <AppCard>
    <p class="card-title">
      {{ props.goal.name }}
    </p>
    <div
      class="radial-progress bg-primary text-primary-content border-4 border-primary"
      :style="`--value:${goalProgress};`"
    >
      {{ goalProgress }}%
    </div>
    <p>
      <strong>
        {{ currency(props.goal.currentAmount) }}
        -
        {{ currency(props.goal.finalAmount) }}
      </strong>
    </p>
  </AppCard>
</template>
