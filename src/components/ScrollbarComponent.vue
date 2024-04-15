<script setup>
const props = defineProps({
  totalCountAll: Number,
  totalPages: Number,
  page: Number,
  count: Number,
  loading: Boolean,

  height: String
})
const emits = defineEmits(['getData'])
const scroll = (e) => {
  const clientH = e.target.clientHeight
  const scrollTop = e.target.scrollTop
  const scrollH = e.target.scrollHeight
  const page = props.page + 1
  if (
    Math.ceil(clientH + scrollTop + 1) >= scrollH &&
    page < props.totalPages &&
    !props.loading
  ) {
    emits('getData', page)
  }
}
</script>

<template>
  <div
    class="scrollbar-content p-1"
    :style="{ height: height }"
    id="scrollbar-content"
    @scroll="scroll"
  >
    <slot name="content"></slot>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';

.scrollbar-content {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.5s;
  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    width: 10px;
    background: $white;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgb($info, 1);
    border-radius: 4px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: $primary;
  }
}
</style>
