<script setup lang="ts">
import { useQueryProvider } from "vue-query";
import NearBy from './components/NearBy.vue'
useQueryProvider();
</script>

<template>
  <h1>Find Nearby Locations</h1>
  <NearBy />
</template>

