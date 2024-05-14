<script setup>
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import { computed, onMounted, ref } from 'vue'
import useKioskBoard from '@/store/kiosk-board.pinia.js'
import { useRoute, useRouter } from 'vue-router'
import IconEdit from '@/components/icons/IconEdit.vue'
import KioskBoardTableComponent from '@/pages/dashboard/kiosk-board/components/KioskBoardTableComponent.vue'
import DurationsDrawerComponent from '@/pages/dashboard/kiosk-board/components/DurationsDrawerComponent.vue'

import { storeToRefs } from 'pinia'
import useCore from '@/store/core.pinia.js'
import useBoardCategory from '@/store/board-category.pinia.js'

const route = useRoute()
const router = useRouter()

const corePinia = useCore()
const boardPinia = useKioskBoard()
const boardCategoryPinia = useBoardCategory()

const { loadingUrl } = storeToRefs(corePinia)
const { statuses } = storeToRefs(boardPinia)
const { categories } = storeToRefs(boardCategoryPinia)

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)
const category = ref(null)
const status = ref(null)
const search = ref(null)
const visible = ref(false)

const timeout = ref()

const hide = () => {
  visible.value = false
}

function handleChangeFilter() {
  router.push({
    query: {
      category: category.value,
      status: status.value,
      search: search.value
    }
  })
  boardPinia.getAllKioskBoards(
    currentPage.value - 1,
    search.value,
    status.value,
    category.value
  )
}
function handleSearch() {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
  timeout.value = setTimeout(() => {
    handleChangeFilter()
  }, 500)
}
const open = ref(false)

const showDrawer = () => {
  open.value = true
}

onMounted(() => {
  boardPinia.getAllKioskBoardStatus(currentPage.value - 1)
  boardPinia.getAllKioskBoardStatus()
  boardCategoryPinia.getAllBoardCategories()
})
</script>

<template>
  <page-header-component :title="$t('DashboardBoardListView')">
    <template #actions>
      <a-space>
        <a-input
          placeholder="Kioskni izlash..."
          v-model:value="search"
          allow-clear
          @keydown="handleSearch"
        />
        <a-tree-select
          v-model:value="category"
          class="board-category-filter select"
          :loading="loadingUrl.has('board/category/all')"
          :dropdown-style="{
            maxHeight: '1000px',
            overflow: 'auto'
          }"
          :placeholder="$t('SELECT_CATEGORY')"
          size="middle"
          allow-clear
          tree-default-expand-all
          :tree-data-simple-mode="[categories]"
          :tree-data="categories"
          tree-node-filter-prop="label"
          @change="handleChangeFilter"
        >
        </a-tree-select>

        <a-select
          @change="handleChangeFilter"
          v-model:value="status"
          placeholder="Status"
          class="select"
          allow-clear
        >
          <a-select-option
            v-for="(item, i) in statuses"
            :key="i"
            :value="item.boardStatus"
          >
            {{ item.localName }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="showDrawer">{{
          $t('KIOSK_TIME')
        }}</a-button>
        <a-drawer
          v-model:open="open"
          root-class-name="kiosk-duration-drawer"
          class="item-duration-drawer"
          :title="$t('KIOSK_DURATIONS')"
          placement="right"
        >
          <durations-drawer-component />
        </a-drawer>
      </a-space>
    </template>
  </page-header-component>
  <kiosk-board-table-component />
</template>

<style lang="scss">
.select {
  width: 200px;
}
.timeChange {
  width: 50px;
}

.kiosk-duration-drawer .ant-drawer-content-wrapper {
  width: 50% !important;
}
</style>
