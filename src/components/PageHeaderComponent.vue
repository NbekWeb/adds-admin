<script setup>
const props = defineProps({
  title: String
})
</script>

<template>
  <div class="page-header">
    <h1 class="title">{{ title }}</h1>
    <slot name="actions"></slot>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .title {
    margin: auto 0;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
