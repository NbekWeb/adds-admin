<script setup>
import { ref } from 'vue'
import { fileBaseUrl } from '@/utils/conf.js'

defineProps({
  file: {
    type: Object,
    required: true
  }
})

const options = ref({ quality: { default: '1080p' } })
</script>

<template>
  <div class="plyr-video" v-bind="$attrs">
    <vue-plyr :options="options" class="plyr--video">
      <video
        class="video-player"
        controls
        crossorigin
        playsinline
        :data-poster="`${fileBaseUrl}/file/${file.snapshotHashId}`"
      >
        <source
          class="vide0-source"
          :src="`${fileBaseUrl}/file/${file.hashId}`"
        />
      </video>
    </vue-plyr>
  </div>
</template>
<style lang="scss">
@import '@/assets/styles/responsive';
.plyr-video {
  width: 80vw;
  height: 80dvh;
  @include responsive-md {
    height: auto;
  }
}
</style>
