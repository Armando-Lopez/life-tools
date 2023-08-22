<script setup lang="ts">
import { APPS_INTEGRATIONS_PATH } from '~/constants/firebaseConstants'
import { GET_JIRA_USER_URL_API } from '~/constants/api'

const { isLoading, createDoc } = useFirestore()
const emit = defineEmits(['onSaveCredentials'])

const formRef = ref(null)
const hasSuccessAuth = ref<boolean|null>(null)
const isValidating = ref(false)
const model = ref({
  username: '',
  password: ''
})

async function checkJiraConnection () {
  try {
    isValidating.value = true
    hasSuccessAuth.value = null
    const { data } = await useFetch(GET_JIRA_USER_URL_API, {
      method: 'POST',
      body: {
        username: model.value.username,
        password: model.value.password
      }
    })
    hasSuccessAuth.value = !!data.value?.accountId
    if (hasSuccessAuth.value) {
      await saveCredentials(data.value.accountId)
    }
  } catch (e) {
    hasSuccessAuth.value = false
  } finally {
    isValidating.value = false
  }
}
async function saveCredentials (accountId: string) {
  const { data: authToken } = await useFetch('/api/buffer-token', {
    method: 'POST',
    body: {
      username: model.value.username,
      password: model.value.password
    }
  })
  const { data } = await createDoc(APPS_INTEGRATIONS_PATH, {
    name: 'JIRA',
    auth: authToken.value,
    accountId
  })
  if (data) {
    emit('onSaveCredentials')
  }
}
</script>

<template>
  <div>
    <p class="mb-5 font-semibold text-lg">
      Agrega las crendenciales para vincularte con JIRA
    </p>
    <AppForm
      ref="formRef"
      v-model="model"
      autocomplete="off"
      :is-loading="Boolean(isLoading || isValidating)"
      @success="checkJiraConnection"
    >
      <AppTextField
        label="Correo de usuario JIRA"
        name="username"
        rules="required"
      />
      <AppTextField
        label="API Token"
        name="password"
        rules="required"
      />
      <div class="mb-4">
        <label for="token" class="text-info cursor-pointer">
          ¿Cómo obtener el API Token?
        </label>
        <input id="token" type="checkbox" class="peer hidden">
        <ul class="list-disc hidden peer-checked:block">
          <li>Accede a tu tablero de Jira.</li>
          <li>Selecciona tu icono de usuario en la esquina superior derecha.</li>
          <li>Selecciona Administrar cuenta.</li>
          <li>Selecciona la pestaña Seguridad.</li>
          <li>Selecciona Crear y administrar tokens de API.</li>
          <li>Crea un token de API.</li>
          <li>Copia y pegalo acá.</li>
        </ul>
      </div>
      <button class="btn btn-block btn-success mb-2 ml-auto">
        <span v-if="isLoading || isValidating" class="loading loading-spinner" />
        <span v-else>Guardar</span>
      </button>
      <div v-if="hasSuccessAuth === false" class="flex items-center gap-1 text-error">
        No se pudo vincular tu cuenta de JIRA. Verifica las credentiales
      </div>
    </AppForm>
  </div>
</template>
