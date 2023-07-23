<script setup lang="ts">
import { WORK_SPACES } from '~/constants/workSpaces'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
</script>

<template>
  <section>
    <div class="max-w-md mx-auto p-4 text-center">
      <h2 class="text-5xl font-bold text-primary">
        Toutils
      </h2>
      <p class="py-6 text-xl">
        Toutils provee un conjunto de herramientas, para facilitar y automatizar tareas
      </p>
      <template v-if="userStore.user.uid">
        <ul class="p-2 space-y-4 border border-gray-400/50 rounded-md">
          <template v-for="workSpace in WORK_SPACES">
            <li v-if="workSpace.isActive" :key="workSpace.id">
              <NuxtLink :to="{ name: workSpace.routeName }" class="flex items-center gap-3 hover:underline">
                <AppIcon :icon="workSpace.icon" width="30" />
                <p class="text-lg font-semibold">
                  {{ workSpace.name }}
                </p>
              </NuxtLink>
            </li>
          </template>
        </ul>
      </template>
      <div v-else>
        <p class="mb-3">
          Inicia sesión de manera segura con Google
        </p>
        <button class="btn" @click="userStore.signIn()">
          <AppIcon icon="devicon:google" />
          Comenzar
        </button>
      </div>
    </div>
  </section>
</template>
