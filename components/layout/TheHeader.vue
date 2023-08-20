<script setup lang="ts">
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const { $auth } = useNuxtApp()
</script>

<template>
  <header class="navbar sticky top-0 z-10 mb-4 bg-base-200 shadow">
    <div class="container mx-auto">
      <div class="flex-1">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/apple-touch-icon.png" class="w-14" alt="Toutils logo">
          <h1 class="text-primary text-2xl font-bold">
            Toutils
          </h1>
        </NuxtLink>
      </div>
      <div v-if="userStore.user.uid" class="flex-none">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-9 rounded-full">
              <img :src="userStore.user.photoURL" :alt="userStore.user.displayName">
            </div>
          </label>
          <ul tabindex="0" class="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <!--            <li>-->
            <!--              <label class="flex items-center">-->
            <!--                <span>Modo oscuro</span>-->
            <!--                <input type="checkbox" class="toggle toggle-md" checked>-->
            <!--              </label>-->
            <!--            </li>-->
            <li>
              <button @click="$auth.signOut()">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
