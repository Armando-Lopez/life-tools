<script setup lang="ts">
import axios from 'axios'
import CreateTask from '~/components/tasks-tracking/CreateTask.vue'
import { useTasksTrackingStore } from '~/stores/tasksTraking'
import TaskCard from '~/components/tasks-tracking/TaskCard.vue'

const tasksStore = useTasksTrackingStore()
// tasksStore.setCalendarAccess(true)
//
onMounted(() => {
  // tasksStore.getTasks()
  axios.get('https://homecapital.atlassian.net/rest/api/3/issue/HCE-1062/worklog', {
    auth: {
      username: 'd.lopez@homecapital.com.co',
      password: 'ATATT3xFfGF07swn7oli2UsjVHNxXU1ru4A0e1-pUFUcrHHbOHtQo1KfEacHMNBT2pwV0QSHq6F-0TfA7DvQEmh2dncWXl_DaAM0BNhxy07Oi913pEcljvjQKu2Ouv7i4Vtm94N1luC1WdhEYSZ6SKHvQ-7vTYXAq4vnQAM-KRUNd5YOCe4BH_4=CE9D5A35'
    }
  }).then((response) => {
    console.log(response)
  })
})
// const { googleAuth, requestAccess } = useGoogleAuth()
//
// function onGetAccess (token: any) {
//   console.log(token)
// }

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
