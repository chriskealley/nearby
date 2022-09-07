<script setup lang="ts" >
import { ref } from 'vue'

interface Location {
  address: {
    city: string;
    country: string;
    country_code: string;
    name: string;
    postcode: string;
    state: string;
  };
  class: string;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
  place_id: string;
  tag_type: string;
  type: string;
}

defineProps<{ locations: Location[] }>()

const state = ref('')
const stateCode = ref('')

</script>

<template>
  <div v-if="locations.length > 0" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="state">State Override</label>
    <input id="state" v-model="state"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="stateCode">State Code</label>
    <input id="stateCode" v-model="stateCode"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <p class="mt-4">Selected Locations: {{ locations.length }}</p>
      <div v-if="state">
        <div v-for="location in locations" :key="location.place_id">
          {{ location.name }}, {{ state }}, {{ stateCode }}
        </div>
      </div>
      <div v-else>
        <div v-for="location in locations" :key="location.place_id">
          {{ location.name }}, {{ location.address.state }}, {{ stateCode }}
        </div>
      </div>
    </div>
  </div>
</template>