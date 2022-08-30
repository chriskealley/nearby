<script setup lang="ts">
import { ref, toRef } from "vue";
import { watchDebounced } from "@vueuse/core";

interface LatLon {
  lat: string;
  lon: string;
}
const props = defineProps<{
  lat: string,
  lon: string,
  markers?: LatLon[],
}>()

const lat = toRef(props, "lat")
const lon = toRef(props, "lon")
const markers = toRef(props, "markers")
const accessToken = import.meta.env.VITE_LOCATIONIQ_TOKEN;
const src = ref(`https://maps.locationiq.com/v3/staticmap?key=${accessToken}&center=${lat.value},${lon.value}&markers=icon:small-red-cutout|${lat.value},${lon.value}`)

watchDebounced(
  markers,
  () => {
    let markerParam = ``;
    if (markers.value && markers.value.length > 0) {
      markerParam += `&markers=icon:tiny-red-cutout`;
      markers.value.forEach((marker) => {
        markerParam += `|${marker.lat},${marker.lon}`;
      });
    }
    src.value = `https://maps.locationiq.com/v3/staticmap?key=${accessToken}&center=${lat.value},${lon.value}&markers=icon:small-red-cutout|${lat.value},${lon.value}${markerParam}`
  },
  { debounce: 2000 },
)

</script>


<template>
  <div class="" v-if="lat != '' && lon != ''">
    <img class=" mx-auto" :src="src" alt="location map">
  </div>
</template>