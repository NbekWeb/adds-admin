<script setup>
import { onMounted } from 'vue'
import useBoardCategory from '@/store/board-category.pinia.js'

const boardCategoryPinia = useBoardCategory()
onMounted(() => {
  boardCategoryPinia.getAllBoardCategories()
})
</script>

<template>
  <a-table />
</template>

<style scoped lang="scss"></style>
