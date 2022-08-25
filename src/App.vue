<script setup lang="ts">
import { useQueryProvider } from "vue-query";
import NearBy from './components/NearBy.vue'
useQueryProvider();
</script>

<template>
  <h1 class="text-3xl font-bold m-4">Find Nearby Locations</h1>
  <NearBy />
</template>

