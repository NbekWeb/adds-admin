<script setup>
import IconLoader from '@/components/icons/IconLoader.vue'
import useCore from '@/store/core.pinia.js'
defineProps({
  loadingUrl: {
    type: String,
    required: true
  },
  size: String
})

const corePinia = useCore()
</script>

<template>
  <a-spin :spinning="corePinia.loadingUrl.has(loadingUrl)" v-bind="$attrs">
    <template #indicator>
      <icon-loader :size="size" />
    </template>
    <slot />
  </a-spin>
</template>

<style scoped lang="scss"></style>
