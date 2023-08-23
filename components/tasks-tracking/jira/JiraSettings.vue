<script setup lang="ts">
import { SETTINGS_PATH } from '~/constants/firebaseConstants'

const { getDoc, updateDoc } = useFirestore()

const jiraIssueUpdateIntervalInSeconds = [
  { text: 'Cada munito', value: 60 },
  { text: 'Cada 3 munitos', value: 60 * 3 },
  { text: 'Cada 5 munitos', value: 60 * 5 },
  { text: 'Cada 10 munitos', value: 60 * 10 },
  { text: 'Cada 15 munitos', value: 60 * 15 },
  { text: 'Cada 30 munitos', value: 60 * 30 },
  { text: 'Cada 45 munitos', value: 60 * 45 },
  { text: 'Cada hora', value: 60 * 60 },
  { text: 'Cada 2 horas', value: 60 * (60 * 2) }
]

const jiraSettings = useState('jiraSettings', () => ({
  autoMoveIssueToProgress: false,
  jiraUpdateIntervalInSeconds: jiraIssueUpdateIntervalInSeconds[0].value,
  path: ''
}))
const formRef = ref(null)

onMounted(() => {
  getSettings()
})

async function getSettings () {
  const { data = {} } = await getDoc(SETTINGS_PATH)
  jiraSettings.value.autoMoveIssueToProgress = data?.autoMoveIssueToProgress || jiraSettings.value.autoMoveIssueToProgress
  jiraSettings.value.jiraUpdateIntervalInSeconds = data?.jiraUpdateIntervalInSeconds || jiraSettings.value.jiraUpdateIntervalInSeconds
  jiraSettings.value.path = data?.path || ''
}

async function saveSettings () {
  if (jiraSettings.value.path) {
    await updateDoc(jiraSettings.value.path, jiraSettings.value)
  }
}
</script>

<template>
  <AppModal>
    <template #activator="{ toggle }">
      <button title="Ajustes" class="btn btn-sm" @click="toggle">
        <AppIcon icon="fluent:settings-28-filled" width="20" />
        <span class="hidden md:block">Ajustes</span>
      </button>
    </template>
    <p class="text-lg font-bold">
      Ajustes
    </p>
    <AppForm ref="formRef" v-model="jiraSettings" class="grid gap-4" @on-update="saveSettings">
      <AppSelect
        name="jiraUpdateIntervalInSeconds"
        :items="jiraIssueUpdateIntervalInSeconds"
        label="Actualizar automaticamente el registro de tiempo en JIRA cada:"
        item-text="text"
        item-value="value"
      />
      <div class="flex items-center gap-2">
        <input
          id="move"
          type="checkbox"
          class="toggle toggle-md toggle-primary"
          :checked="jiraSettings.autoMoveIssueToProgress"
          @change="formRef.setFieldValue('autoMoveIssueToProgress', $event.target.checked)"
        >
        <label for="move" class="cursor-pointer">
          Al iniciar el conteo, mover la insidencia a <strong class="text-secondary">En curso</strong>
        </label>
      </div>
    </AppForm>
  </AppModal>
</template>
