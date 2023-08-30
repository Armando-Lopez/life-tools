<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'

const props = defineProps<{ jiraIssue: Task }>()

const { now, secondsTextFormat } = useTime()
const { isLoading, getJiraIssueWorkLogs } = useJiraIssue()

const jiraIssueWorkLogs = ref([])
const weeksAgo = ref(0)

const currentWeek = computed<any>((): any => {
  const today = now()
  const start = today.startOf('week').subtract(weeksAgo.value, 'week')
  const end = today.endOf('week').subtract(weeksAgo.value, 'week')
  const weekStart = start.startOf('week')
  const workLogReportPerDay = []
  for (let i = 0; i < 7; i++) {
    const weekDay = weekStart.add(i, 'day')
    const sameDayWorkLogs = jiraIssueWorkLogs.value.filter((w: any) => now(w.started).isSame(weekDay, 'day'))
    const dayTimeSpendSecond = sameDayWorkLogs.reduce((acc: number, w: any) => acc + w.timeSpentSeconds, 0)
    workLogReportPerDay.push({
      name: weekDay.format('ddd'),
      timeSpent: secondsTextFormat(dayTimeSpendSecond)
    })
  }

  return {
    start: { date: start.format('YYYY-MM-DD') },
    end: { date: end.format('YYYY-MM-DD') },
    workLogReportPerDay
  }
})

async function getWorkLogs () {
  const today = now()
  const weekStarInMilliseconds = today.startOf('week').subtract(weeksAgo.value, 'week').valueOf()
  const weekEndInMilliseconds = today.endOf('week').subtract(weeksAgo.value, 'week').valueOf()
  const { data } = await getJiraIssueWorkLogs({
    issueCode: props.jiraIssue.code,
    startedAfter: weekStarInMilliseconds,
    startedBefore: weekEndInMilliseconds
  })
  jiraIssueWorkLogs.value = data?.worklogs || []
}

function serNextWeek () {
  if (isLoading.value || weeksAgo.value === 0) { return }
  weeksAgo.value--
  getWorkLogs()
}

function setPrevWeek () {
  if (isLoading.value) { return }
  weeksAgo.value++
  getWorkLogs()
}
</script>

<template>
  <AppAccordion @on-open="getWorkLogs">
    <template #header>
      <AppIcon icon="mdi:calendar-clock-outline" width="20" class="mr-2 text-info" />
      Historial
    </template>
    <div class="flex justify-between items-center gap-2 mb-3">
      <div>
        Semana:
        <strong>{{ currentWeek.start.date }} / {{ currentWeek.end.date }}</strong>
      </div>
      <div class="flex gap-2">
        <button
          class="btn btn-sm btn-accent p-1 shadow"
          title="semana anterior"
          @click="setPrevWeek"
        >
          <AppIcon icon="grommet-icons:form-previous-link" width="20" />
        </button>
        <button
          class="btn btn-sm btn-accent p-1 shadow"
          title="semana siguiente"
          :disabled="weeksAgo === 0"
          @click="serNextWeek"
        >
          <AppIcon icon="grommet-icons:form-next-link" width="20" />
        </button>
      </div>
    </div>
    <AppLoader v-if="isLoading" class="scale-50 mx-auto" />
    <ul  v-else class="grid grid-cols-7 mb-2">
      <li v-for="day in currentWeek.workLogReportPerDay" :key="day.name" class="grid">
        <span>{{ day.name }}</span>
        <strong>{{ day.timeSpent || '-' }}</strong>
      </li>
    </ul>
  </AppAccordion>
</template>
