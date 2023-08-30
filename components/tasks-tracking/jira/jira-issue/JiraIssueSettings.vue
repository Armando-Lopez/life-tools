<script setup lang="ts">
import { Task } from '~/interfaces/tasksTracking'

const { deleteDoc, updateDoc } = useFirestore()

const props = defineProps<{ issue: Task }>()
const emit = defineEmits(['onTogglePin', 'onDeleted'])

async function togglePinJiraIssue () {
  const newValue = Boolean(!props.issue.isPinned)
  const { data } = await updateDoc(props.issue.path, { isPinned: newValue })
  if (data) {
    emit('onTogglePin', { id: props.issue.id, isPinned: newValue })
  }
}

async function confirmDelete () {
  const canDelete = confirm('No se eliminarán los registros de tiempo en JIRA. ¿Eliminar tarea?')
  if (canDelete) {
    const hasDelete = await deleteDoc(props.issue.path as string)
    if (hasDelete) {
      emit('onDeleted', props.issue)
    }
  }
}
</script>

<template>
  <AppDropdown content-class="w-52 divide-y divide-neutral-content/10">
    <template #activator>
      <AppIcon icon="fluent:settings-28-filled" width="25" title="administrar insidencia" />
    </template>
    <li>
      <button class="flex" @click="togglePinJiraIssue()">
        <AppIcon icon="mdi:pin" width="20" class="text-blue-500" />
        <span v-if="props.issue.isPinned">Desanclar del inicio</span>
        <span v-else>Anclar al inicio</span>
      </button>
    </li>
    <li>
      <button class="flex" @click="confirmDelete">
        <AppIcon icon="material-symbols:delete" width="20" class="text-red-500" />
        Eliminar
      </button>
    </li>
  </AppDropdown>
</template>
