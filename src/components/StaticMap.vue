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

// const lat = toRef(props, "lat")
// const lon = toRef(props, "lon")
const markers = toRef(props, "markers")
const accessToken = import.meta.env.VITE_LOCATIONIQ_TOKEN;
const src = ref('')
if (props.lat && props.lon) src.value = `https://maps.locationiq.com/v3/staticmap?key=${accessToken}&center=${props.lat},${props.lon}&markers=icon:small-red-cutout|${props.lat},${props.lon}`

watchDebounced(
  markers,
  () => {
    let markerParam = ``;
    if (props.markers && props.markers.length > 0) {
      markerParam += `&markers=icon:tiny-red-cutout`;
      props.markers.forEach((marker) => {
        markerParam += `|${marker.lat},${marker.lon}`;
      });
    }
    src.value = `https://maps.locationiq.com/v3/staticmap?key=${accessToken}&center=${props.lat},${props.lon}&markers=icon:small-red-cutout|${props.lat},${props.lon}${markerParam}`
  },
  { debounce: 2000 },
)

</script>


<template>
  <div class="" v-if="lat && lon">
    <img class=" mx-auto" :src="src" alt="location map">
  </div>
</template>