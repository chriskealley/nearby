<script setup lang="ts" >
import { computed, ref } from 'vue'
import IconCopyToClipboard from "./IconCopyToClipboard.vue"

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

const props = defineProps<{ locations: Location[] }>()

const state = ref('')
const stateCode = ref('')

const selected = computed(() => {
  if (state.value) {
    return props.locations.map((location) => {
      return `${location.name}, ${state.value}, ${stateCode.value}`
    })
  }
  return props.locations.map((location) => {
    return `${location.name}, ${location.address.state}, ${stateCode.value}`
  })
})

const copied = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(selected.value.join('\r\n'))
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

</script>

<template>
  <div v-if="locations.length > 0" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div>
      <label class=" block text-gray-700 text-sm font-bold mt-4 mb-2" for="state">State Override</label>
      <input id="state" v-model="state"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <label class="block text-gray-700 text-sm font-bold mt-4 mb-2" for="stateCode">State Code</label>
      <input id="stateCode" v-model="stateCode"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <div class="flex items-center gap-2">
        <p class="my-4 font-bold">Selected Locations: {{ locations.length }}</p>
        <IconCopyToClipboard class="hover:cursor-pointer" @click="copyToClipboard" />
        <span v-if="copied">Copied to clipboard</span>
      </div>
      <div v-for="location in selected" :key="location">
        {{ location }}
      </div>
    </div>
  </div>
</template>