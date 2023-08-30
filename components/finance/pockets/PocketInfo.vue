<script setup lang="ts">
import { Pocket } from '~/interfaces/finance'

const props = defineProps<{ pocket: Pocket }>()

const { currency } = useFilter()
</script>

<template>
  <AppCard>
    <p class="card-title">
      {{ props.pocket.name }}
    </p>
    <p class="text-green-600 text-xl">
      {{ currency(props.pocket.amount) }}
    </p>
  </AppCard>
</template>
