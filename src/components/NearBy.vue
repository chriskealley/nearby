<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";
import { refDebounced } from '@vueuse/core'
import { useAutoComplete } from "../composables/queries";
import SelectedLocations from "./SelectedLocations.vue"
import StaticMap from "./StaticMap.vue";
import FoundLocations from "./FoundLocations.vue";

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

const selectedAddress = ref()
const radius = ref(5)
const locationsTotal = ref(10)
const limit = refDebounced(locationsTotal, 1000)
const inputAddress = ref('')
const tags = ref([
  { place: "city", name: "Cities", selected: true },
  { place: "borough", name: "Boroughs", selected: false },
  { place: "quarter", name: "Quarters", selected: false },
  { place: "suburb", name: "Suburbs", selected: true },
  { place: "neighbourhood", name: "Neighbourhoods", selected: false },
])

const selectedTags = refDebounced(computed(() => tags.value.filter((tag) => tag.selected).map((tag) => tag.place)), 1000)

const searchAddress = refDebounced(inputAddress, 2500)

const { isLoading: autoIsLoading, isError: autoIsError, data: autoData } = useAutoComplete(searchAddress)

const selectedLat: Ref<string> = ref('')
const selectedLon: Ref<string> = ref('')

const selectedLocations: Ref<Location[]> = ref([])

const markers = computed(() => {
  return selectedLocations.value?.map((location) => {
    return { lat: location.lat, lon: location.lon }
  }) || []
})

watch(inputAddress, () => {
  selectedLat.value = ''
  selectedLon.value = ''
  selectedLocations.value = []
})

watch(selectedAddress, () => {
  selectedLat.value = selectedAddress.value.lat
  selectedLon.value = selectedAddress.value.lon
  selectedLocations.value = []
})

</script>

<template>
  <div class="md:grid grid-cols-2 gap-2">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="grid grid-rows-2 items-center" style="grid-template-columns:1fr min-content;">
            <label class="text-gray-700 text-sm font-bold mb-2 mr-2" for="radius">Radius (2-25km):</label>
            <input
              class="shadow appearance-none border rounded p-1 m-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number" id="radius" name="radius" min="2" max="25" v-model="radius">

            <label class="text-gray-700 text-sm font-bold mb-2 mr-2" for="locationsTotal">Total locations
              (10-50):</label>
            <input class="shadow appearance-none border rounded p-1 m-1 text-gray-700 leading-tight
        focus:outline-none focus:shadow-outline" type="number" id="locationsTotal" name="locationsTotal" min="10"
              max="50" v-model="locationsTotal">
          </div>
        </div>

      </div>
      <div>
        <fieldset>
          <legend>Choose your place types:</legend>
          <div v-for="place in tags" :key="place.place">
            <input class="mr-2 leading-tight" type="checkbox" :id="place.place" v-model="place.selected">
            <label class="text-gray-700 text-sm font-bold mb-2" :for="place.place"
              @click="place.selected = !place.selected">{{ place.name }}</label>
          </div>
        </fieldset>
      </div>

      <label class="block text-gray-700 text-sm font-bold mb-2 mt-4" for="inputAddress">Search Address</label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="inputAddress" v-model="inputAddress">
    </div>

    <div v-if="searchAddress != ''" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <p class="my-4 font-bold">Found Addresses:</p>
      <span v-if="autoIsLoading">Loading...</span>
      <span v-else-if="autoIsError">Sorry, can't find that Location.</span>
      <div v-else>
        <div v-for=" location in autoData" :key="location.place_id" v-on:click="selectedAddress = location">
          <input class="mr-2 leading-tight" type="radio" :id="location" :value="location" v-model="selectedAddress" />
          <label class="text-gray-700 text-sm mb-2" for="location">{{ location.display_name }}</label>
        </div>
      </div>
    </div>
  </div>
  <div class="md:grid grid-cols-2 gap-2">
    <FoundLocations :lat="selectedLat" :lon="selectedLon" :radius="radius" :tags="selectedTags" :limit="limit"
      v-model:locations="selectedLocations" />
    <SelectedLocations :locations="selectedLocations" />
  </div>
  <StaticMap :lat="selectedLat" :lon="selectedLon" :markers="markers" />

</template>
