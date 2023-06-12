<script setup lang="ts">
const route = useRoute()
console.log(route)
</script>

<template>
  <section>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h2 class="text-5xl font-bold">
            Life tools
          </h2>
          <p class="py-6">
            Life tools provee un conjunto de herramientas para la vida contidiana
          </p>
          <ul class="p-2 divide-y border border-gray-400/50 rounded-md">
            <li>
              <NuxtLink to="/finanzas" class="flex items-center gap-3 hover:underline">
                <AppIcon icon="emojione:money-bag" width="30" />
                <p class="text-lg font-semibold">
                  Mis finanzas
                </p>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
