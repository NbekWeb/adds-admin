<script setup>
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import { computed, onMounted } from 'vue'
import useBoard from '@/store/board.pinia.js'
import { useRoute } from 'vue-router'

import BoardTableComponent from '@/pages/dashboard/board/components/BoardTableComponent.vue'
import { storeToRefs } from 'pinia'

const route = useRoute()

const boardPinia = useBoard()

const { statuses } = storeToRefs(boardPinia)

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

onMounted(() => {
  boardPinia.getAllBoards(currentPage.value - 1)
  boardPinia.getAllBoardStatus()
})
</script>

<template>
  <page-header-component :title="$t('DashboardBoardListView')">
    <template #actions>
      <a-space>
        <a-input placeholder="Kanalni izlash..." />
        <a-select placeholder="Status" class="select" allow-clear>
          <a-select-option value="ACTIVE"> Faol </a-select-option>
        </a-select>
        <a-select placeholder="Status" class="select" allow-clear>
          <a-select-option v-for="item in statuses" :value="item.boardStatus">
            {{ item.localName }}
          </a-select-option>
        </a-select>
      </a-space>
    </template>
  </page-header-component>
  <board-table-component />
</template>

<style scoped lang="scss">
.select {
  width: 200px;
}
</style>
