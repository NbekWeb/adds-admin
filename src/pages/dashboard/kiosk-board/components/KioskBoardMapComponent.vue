<script setup>
import {ref, computed} from "vue";
import 'leaflet/dist/leaflet.css';

import {LMap, LTileLayer, LMarker} from "@vue-leaflet/vue-leaflet";

const emits = defineEmits(['change']);
const props = defineProps({
  markers:{
    type: [Array,null],
    default: null
  }
});
const url = ref(`https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=bG8hsL9iJdnFJSSSpai0`)
const zoom = ref(15);

const markers = computed(() => props.markers || [['41.311081','69.240562']])
const click = e=>{
  emits('change',e);
}
</script>

<template>
  <div class="map-block">
    <l-map @click="click" v-model:zoom="zoom" :center="markers[0]" :use-global-leaflet="false">
      <l-tile-layer
        :url="url"
        layer-type="base"
        name="OpenStreetMap"
      />
      <l-marker v-for="(marker,index) in markers" :key="`markerKey${marker?.join()}${index}`" :lat-lng="marker"/>
    </l-map>
    <div class="map-buttons">
      <slot name="button"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/breakpoints.scss';

.map-block{
  position: relative;
  height: 500px;
  .map-buttons{
    text-align: right;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255,255,255,.5);
    backdrop-filter: blur(4px);
    padding: 10px 1rem;
    z-index: 99999;
  }
}

@include breakpoint(992px) {
  .map-block {
    height: 300px;
  }
}
</style>