<script setup lang="ts">
</script>

<template>
  <main class="flex-grow flex flex-col container mx-auto pb-16">
    <div class="flex-grow relative">
      <NuxtPage />
    </div>
  </main>
  <nav class="fixed bottom-0 container mx-auto w-full finance-nav">
    <ul class="menu menu-horizontal rounded-t-box overflow-hidden grid grid-cols-3 w-full p-0 bg-base-200 shadow-inner">
      <li>
        <NuxtLink :to="{ name: 'finanzas-bolsillos' }" class="relative flex flex-col">
          <AppIcon icon="simple-icons:pocket" width="15" color="#8c630b" />
          <span>Bolsillos</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'finanzas-metas' }" class="relative flex flex-col">
          <AppIcon icon="fluent:savings-16-filled" width="15" color="pink" />
          <span>Metas</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'finanzas-movimientos' }" class="relative flex flex-col">
          <AppIcon icon="grommet-icons:transaction" width="15" color="orange" />
          <span>Movimientos</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
