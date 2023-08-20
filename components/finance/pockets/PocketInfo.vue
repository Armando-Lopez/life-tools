<script setup lang="ts">
import { Pocket } from '~/interfaces/finance'

const props = defineProps<{ pocket: Pocket }>()

const { currency } = useFilter()
</script>

<template>
  <AppCard>
    <!--    <div class="dropdown dropdown-end absolute right-2 top-2">-->
    <!--      <label tabindex="0" class="cursor-pointer">-->
    <!--        <AppIcon icon="pepicons-pop:dots-y" width="25" />-->
    <!--      </label>-->
    <!--      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">-->
    <!--        <li>-->
    <!--          <button @click="financeStore.setPocketToEdit(props.pocket)">-->
    <!--            Editar-->
    <!--            <AppIcon icon="material-symbols:edit" class="text-info" />-->
    <!--          </button>-->
    <!--        </li>-->
    <!--        <li>-->
    <!--          <button @click="deletePocket()">-->
    <!--            Eliminar-->
    <!--            <AppIcon icon="material-symbols:delete" class="text-red-600" />-->
    <!--          </button>-->
    <!--        </li>-->
    <!--      </ul>-->
    <!--    </div>-->
    <p class="card-title">
      {{ props.pocket.name }}
    </p>
    <p class="text-green-600 text-xl">
      {{ currency(props.pocket.amount) }}
    </p>
  </AppCard>
</template>
