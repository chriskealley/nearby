<script setup lang="ts">
import { useQueryProvider } from "vue-query";
useQueryProvider();

import NearBy from './components/NearBy.vue'
</script>

<template>
  <h1>Find Nearby Locations</h1>
  <NearBy />
</template>

