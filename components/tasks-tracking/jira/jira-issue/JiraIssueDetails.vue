<script setup lang="ts">
import { PropType } from 'vue'
import { JIRA_ISSUES_URL_API } from '~/constants/api'
import { Task } from '~/interfaces/tasksTracking'

const props = defineProps({
  issue: {
    type: Object as PropType<Task>,
    required: true
  }
})

const { textTimeToSeconds } = useTime()
const { data, pending, execute: getJiraIssueDetails } = await useFetch(JIRA_ISSUES_URL_API, {
  lazy: true,
  server: false,
  immediate: false,
  // @ts-ignore
  headers: { authorization: useState('jiraAuth').value },
  query: { issueCode: props.issue.code }
})

function handleGetData () {
  if (!data.value) {
    getJiraIssueDetails()
  }
}
</script>

<template>
  <article>
    <AppAccordion @on-open="handleGetData()">
      <template #header>
        <button class="mr-4">
          <AppIcon icon="carbon:view-filled" width="20" class="text-info" />
        </button>
        Ver más detalles
      </template>
      <AppLoader v-if="pending" class="mt-3 mx-auto scale-75" />
      <div v-else-if="data">
        <p class="mb-3 line-clamp-1" :title="data.summary">
          {{ data.summary }}
        </p>
        <div class="flex items-center gap-2 mb-3">
          <img :src="data.issueTypeIconUrl" :alt="data.issueTypeName" width="16">
          <span>{{ data.issueTypeName }}</span>
          -
          <img :src="data.priorityIconUrl" :alt="data.priorityName" width="16">
          <span>{{ data.priorityName }}</span>
          -
          <div class="w-4 h-4 rounded-md" :style="{ background: data.statusCategoryColor }" />
          <span>{{ data.statusName }}</span>
        </div>
        <div>
          <!--          {{ data.fields.timetracking }}-->
          <div class="mb-2 grid items-center grid-cols-4 gap-2">
            <p class="col-span-1">
              Tiempo estimado:
            </p>
            <div class="col-span-3 ml-auto">
              <AppCountdown
                v-if="data.originalEstimate"
                :seconds="textTimeToSeconds(data.originalEstimate)"
                class="text-lg"
              />
              <p v-else class="flex items-center gap-2">
                <AppIcon icon="emojione-v1:warning" width="16" />
                <strong>Sin estimación</strong>
              </p>
            </div>
          </div>
          <!--          <div class="mb-2 grid grid-cols-4 gap-2">-->
          <!--            <p class="col-span-1">-->
          <!--              Tiempo regitrado:-->
          <!--            </p>-->
          <!--            <div class="col-span-3 ml-auto">-->
          <!--              <AppCountdown-->
          <!--                v-if="data.fields.timetracking.originalEstimate"-->
          <!--                :seconds="textTimeToSeconds(data.fields.timetracking.remainingEstimate)"-->
          <!--                class="text-lg"-->
          <!--              />-->
          <!--              <p v-else class="flex items-center gap-2">-->
          <!--                <AppIcon icon="emojione-v1:warning" width="16" />-->
          <!--                <strong>Sin estimación</strong>-->
          <!--              </p>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </AppAccordion>
  </article>
</template>
