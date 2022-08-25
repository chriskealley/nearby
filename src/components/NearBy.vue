<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";
import { refDebounced } from '@vueuse/core'

import { useAutoComplete, useNearby } from "../composables/queries";

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
const state = ref('')
const stateCode = ref('')

const selectedTags = refDebounced(computed(() => tags.value.filter((tag) => tag.selected).map((tag) => tag.place)), 1000)

const searchAddress = refDebounced(inputAddress, 2500)

const { isLoading: autoIsLoading, isError: autoIsError, data: autoData, error: autoError } = useAutoComplete(searchAddress)

const selectedLat: Ref<string> = ref('')
const selectedLon: Ref<string> = ref('')
const radiusM = refDebounced(computed(() => (radius.value * 1000)), 1000)

const selectedLocations: Ref<any[]> = ref([])

watch(selectedAddress, () => {
  selectedLat.value = selectedAddress.value.lat
  selectedLon.value = selectedAddress.value.lon
})

watch(inputAddress, () => {
  selectedLat.value = ''
  selectedLon.value = ''
  selectedLocations.value = []
})

const { isLoading: nearbyIsLoading, isSuccess: nearbyIsSuccess, isError: nearbyIsError, data: nearbyData, error: nearbyError } = useNearby(selectedLat, selectedLon, radiusM, selectedTags, limit)

</script>

<template>
  <div>
    <div>
      <label for="radius">Radius (2-25km):</label>
      <input type="number" id="radius" name="radius" min="2" max="25" v-model="radius">
    </div>
    <div>
      <label for="locationsTotal">Total locations (10-50):</label>
      <input type="number" id="locationsTotal" name="locationsTotal" min="10" max="50" v-model="locationsTotal">
    </div>
    <div>
      <fieldset>
        <legend>Choose your place types:</legend>
        <div v-for="place in tags" :key="place.place">
          <input type="checkbox" :id="place.place" v-model="place.selected">
          <label :for="place.place" @click="place.selected = !place.selected">{{ place.name }}</label>
        </div>
      </fieldset>
    </div>
  </div>
  <div>
    <label for="inputAddress">Search Address</label>
    <input id="inputAddress" v-model="inputAddress">
  </div>

  <div v-if="searchAddress != ''">
    <p>Found Addresses</p>
    <span v-if="autoIsLoading">Loading...</span>
    <span v-else-if="autoIsError">Sorry, can't find that Location.</span>
    <div v-else>
      <div v-for=" location in autoData" :key="location.place_id" v-on:click="selectedAddress = location">
        <input type="radio" :id="location" :value="location" v-model="selectedAddress" />
        <label for="location">{{ location.display_name }}</label>
      </div>
    </div>
  </div>

  <div v-if="nearbyData && nearbyData.length > 0">
    <span v-if="nearbyIsLoading">Finding Nearby Locations...</span>
    <span v-else-if="nearbyIsError">Sorry, can't find any Nearby Locations.</span>
    <div v-else-if="nearbyIsSuccess">
      <p>Found Locations: {{ nearbyData.length }}</p>
      <div v-for="location in nearbyData" :key="location.place_id">
        <input type="checkbox" :id="location.place_id" :value="location" v-model="selectedLocations">
        <label :for="location.place_id">{{ location.address.name }} - {{ location.address.state }} - {{
            location.type.toUpperCase()
        }}</label>
      </div>
    </div>
  </div>

  <div v-if="selectedLocations.length > 0">
    <label for="state">State Override</label>
    <input id="state" v-model="state">
    <label for="stateCode">State Code</label>
    <input id="stateCode" v-model="stateCode">
    <p>Selected Locations: {{ selectedLocations.length }}</p>
    <div v-if="state" v-for="location in selectedLocations">
      {{ location.name }}, {{ state }}, {{ stateCode }}
    </div>
    <div v-else v-for="location in selectedLocations">
      {{ location.name }}, {{ location.address.state }}, {{ stateCode }}
    </div>
  </div>

</template>
