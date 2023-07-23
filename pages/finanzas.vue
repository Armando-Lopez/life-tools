<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({ middleware: 'auth' })
const userStore = useUserStore()
</script>

<template>
  <main class="flex-grow flex flex-col container mx-auto pb-16">
    <div v-if="userStore.hasLoadedAuth" class="flex-grow relative">
      <NuxtPage />
    </div>
  </main>
  <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 container w-full finance-nav">
    <ul class="menu menu-horizontal overflow-hidden grid grid-cols-3 w-full p-0 bg-base-200 shadow-inner">
      <li>
        <NuxtLink :to="{ name: 'finanzas-bolsillos' }" class="relative flex flex-col px-1 rounded-none">
          <AppIcon icon="simple-icons:pocket" width="15" class="text-green-500" />
          <span>Bolsillos</span>
        </NuxtLink>
      </li>
      <!--      <li>-->
      <!--        <NuxtLink :to="{ name: 'finanzas-ahorros' }" class="relative flex flex-col px-1 rounded-none">-->
      <!--          <AppIcon icon="fluent:savings-16-filled" width="15" class="text-pink-400" />-->
      <!--          <span>Ahorros</span>-->
      <!--        </NuxtLink>-->
      <!--      </li>-->
      <li>
        <NuxtLink :to="{ name: 'finanzas-inversiones' }" class="relative flex flex-col px-1 rounded-none">
          <AppIcon icon="lucide:goal" width="15" color="red" />
          <span>Inversiones</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'finanzas-movimientos' }" class="relative flex flex-col px-1 rounded-none">
          <AppIcon icon="grommet-icons:transaction" width="15" color="orange" />
          <span>Movimientos</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
