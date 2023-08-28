<script setup lang="ts">
const props = defineProps({
  seconds: { type: Number, required: true }
})
const { duration } = useTime()
const timeDurations = computed(() => duration(props.seconds))
</script>

<template>
  <div class="flex justify-between gap-5 w-fit text-center auto-cols-max">
    <div class="flex flex-col">
      <span class="countdown font-mono">
        <span :style="`--value:${timeDurations.days};`" />
      </span>
      <span class="text-sm">
        Días
      </span>
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono">
        <span :style="`--value:${timeDurations.hours};`" />
      </span>
      <span class="text-sm">
        Horas
      </span>
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono">
        <span :style="`--value:${timeDurations.minutes};`" />
      </span>
      <span class="text-sm">
        Minutos
      </span>
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono">
        <span :style="`--value:${timeDurations.seconds};`" />
      </span>
      <span class="text-sm">
        Segundos
      </span>
    </div>
  </div>
</template>
