<script setup lang="ts">
import dayjs from 'dayjs'
import { Task } from '~/interfaces/tasksTracking'
import { useTasksTrackingStore } from '~/stores/tasksTraking'

const props = defineProps<{ task: Task }>()
const tasksStore = useTasksTrackingStore()
const updateStoreIntervalInSeconds = 5
const updateCalendarIntervalInSeconds = 60

const duration = computed(() => {
  // @ts-ignore
  const duration = dayjs.duration(props.task.trackingSeconds * 1000)
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()
  return { days, hours, minutes, seconds }
})

const { isPending: isTracking, start, stop } = useTimeoutFn(handleTracking, 1000)
stop()
function handleTracking () {
  const storedTask = tasksStore.tasks.data.find(t => t.id === props.task.id)
  // @ts-ignore
  const totalSeconds = storedTask.trackingSeconds += 1
  if (totalSeconds % updateStoreIntervalInSeconds === 0) {
    tasksStore.updateTask(props.task.id, {
      trackingSeconds: totalSeconds
    })
    if (totalSeconds % updateCalendarIntervalInSeconds === 0) {
      updateCalendar()
    }
  }
  start()
}
function startTracking () {
  start()
  tasksStore.setCurrentTaskId(props.task.id as string)
  if (!tasksStore.hasCalendarAccess) {
    return
  }
  tasksStore.createCalendarTaskEvent(
    props.task.id,
    {
      summary: props.task.name as string,
      description: props.task.description as string
    }
  )
}
function stopTracking () {
  stop()
  tasksStore.setCurrentTaskId(null)
  tasksStore.updateTask(props.task.id, {
    trackingSeconds: props.task.trackingSeconds,
    lastCalendarEventId: ''
  })
}
function confirmDelete () {
  const canDelete = confirm('¿Eliminar tarea?')
  if (canDelete) {
    tasksStore.deleteTask(props.task.id || null)
  }
}
function updateCalendar () {
  if (!tasksStore.hasCalendarAccess) {
    return
  }
  if (props.task.lastCalendarEventId) {
    tasksStore.updateCalendarTaskEvent(props.task.lastCalendarEventId)
  } else {
    tasksStore.createCalendarTaskEvent(
      props.task.id,
      {
        summary: props.task.name as string,
        description: props.task.description as string
      }
    )
  }
}

</script>

<template>
  <div class="card w-80 bg-base-100 shadow-md border border-gray-200/50">
    <div class="card-body">
      <h2 class="card-title">
        {{ props.task.name }}
      </h2>
      <div class="flex justify-between gap-4">
        <div>
          <button v-if="!isTracking" @click="startTracking">
            <AppIcon icon="solar:play-bold" width="30" class="text-green-500" />
          </button>
          <button v-else @click="stopTracking">
            <AppIcon icon="solar:stop-bold" width="30" class="text-orange-600" />
          </button>
        </div>
        <button @click="confirmDelete">
          <AppIcon icon="material-symbols:delete" width="30" class="text-red-600" />
        </button>
      </div>
      <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div class="flex flex-col">
          <span class="countdown font-mono text-3xl">
            <span :style="`--value:${duration.days};`" />
          </span>
          Días
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-3xl">
            <span :style="`--value:${duration.hours};`" />
          </span>
          Horas
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-3xl">
            <span :style="`--value:${duration.minutes};`" />
          </span>
          Minutos
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-3xl">
            <span :style="`--value:${duration.seconds};`" />
          </span>
          Segundos
        </div>
      </div>
      <div class="divider m-0" />
      <p>{{ props.task.description }}</p>
    </div>
  </div>
</template>
