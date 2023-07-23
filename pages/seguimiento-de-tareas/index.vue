<script setup lang="ts">
import CreateTask from '~/components/tasks-tracking/CreateTask.vue'
import { useTasksTrackingStore } from '~/stores/tasksTraking'
import TaskCard from '~/components/tasks-tracking/TaskCard.vue'

const tasksStore = useTasksTrackingStore()
tasksStore.setCalendarAccess(true)

onMounted(() => {
  tasksStore.getTasks()
})
const { googleAuth, requestAccess } = useGoogleAuth()

function onGetAccess (token: any) {
  console.log(token)
}

</script>

<template>
  <main class="flex-grow flex flex-col container mx-auto">
    <section class="relative flex-grow px-4">
      <div v-if="!googleAuth" class="text-center my-3">
        <p class="md:text-xl">
          Realiza seguimiento del tiempo invertido en diferentes tareas
        </p>
        <p>
          Para mejor control, las tareas se registrarán en tu calendario de Google
        </p>
        <button class="btn btn-info mt-4" @click="requestAccess(onGetAccess)">
          Acceder al  alendario
        </button>
      </div>
      <div class="flex flex-wrap gap-4">
        <TaskCard
          v-for="task in tasksStore.tasks.data"
          :key="task.id"
          :task="task"
        />
      </div>
      <CreateTask />
    </section>
  </main>
</template>
