<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <main class="flex-grow flex flex-col container mx-auto px-4">
    <h1 class="text-primary text-xl font-bold">
      Registro de tiempos
    </h1>
    <section class="relative flex-grow">
      <div class="my-3">
        <p class="md:text-xl mb-2">
          Realiza registros del tiempo invertido actividades
        </p>
        <p>
          Elige donde guardar el registo de tiempo:
        </p>
        <div class="mt-4">
          <NuxtLink :to="{ name: 'registro-de-tiempos-jira' }">
            <AppCard>
              <div class="flex gap-2 mb-2">
                <AppIcon icon="devicon:jiraalign" width="40" />
                <h3 class="font-bold text-3xl">
                  JIRA
                </h3>
              </div>
              <p class="text-log">
                Registar tiempo automáticamente en tareas de JIRA
              </p>
            </AppCard>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
