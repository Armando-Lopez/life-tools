<script setup lang="ts">
const props = defineProps({
  seconds: { type: Number, required: true }
})
const { duration } = useTime()
const timeDurations = computed(() => duration(props.seconds * 1000))
</script>

<template>
  <div class="flex justify-between gap-5 w-fit text-center auto-cols-max">
    <div class="flex flex-col">
      <span class="countdown font-mono text-2xl">
        <span :style="`--value:${timeDurations.days};`" />
      </span>
      Días
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-2xl">
        <span :style="`--value:${timeDurations.hours};`" />
      </span>
      Horas
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-2xl">
        <span :style="`--value:${timeDurations.minutes};`" />
      </span>
      Minutos
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-2xl">
        <span :style="`--value:${timeDurations.seconds};`" />
      </span>
      Segundos
    </div>
  </div>
</template>
