<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import { computed, toRef } from 'vue';
import { useNearby } from '../composables/queries';

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

const props = defineProps<{
  lat: string,
  lon: string,
  radius: number,
  tags?: string[],
  limit?: number,
  locations: Location[]
}>();

const emit = defineEmits([
  'update:locations'
])

const selectAll = computed(() => {
  if (data.value.length == selected.value.length) return true
  return false
})

// watch(selectAll, () => {
//   if (selectAll.value) selected.value = data.value
//   else selected.value = []
// })

function selectAllFound() {
  if (data.value.length == selected.value.length) selected.value = []
  else selected.value = data.value
}


const selected = computed({
  get() {
    return props.locations
  },
  set(value) {
    emit('update:locations', value)
  }
})

const lat = toRef(props, "lat");
const lon = toRef(props, "lon")
const tags = toRef(props, "tags")
const limit = toRef(props, "limit")
const radiusM = refDebounced(computed(() => (props.radius * 1000)), 1000)
const { isLoading, isSuccess, isError, data } = useNearby(lat, lon, radiusM, tags, limit)

</script>

<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" v-if="data && data.length > 0">
    <span v-if="isLoading">Finding Nearby Locations...</span>
    <span v-else-if="isError">Sorry, can't find any Nearby Locations.</span>
    <div v-else-if="isSuccess">
      <p class="my-4 font-bold">Found Locations: {{ data.length }}</p>
      <input class="mr-2 leading-tight" type="checkbox" v-model="selectAll" id="selectAll" @click="selectAllFound">
      <label class="text-gray-700 text-sm font-bold my-4" for="selectAll">Select All</label>
      <div v-for="location in data" :key="location.place_id">
        <input class="mr-2 leading-tight" type="checkbox" :value="location" :id="location.place_id" v-model="selected">
        <label class="text-gray-700 text-sm mb-2" :for="location.place_id">
          {{ location.address.name }} - {{ location.address.state }} - {{ location.type.toUpperCase() }}
        </label>
      </div>
    </div>
  </div>
</template>