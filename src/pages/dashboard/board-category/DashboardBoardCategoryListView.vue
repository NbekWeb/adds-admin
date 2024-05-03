<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useBoardCategory from '@/store/board-category.pinia.js'
import useCore from '@/store/core.pinia.js'
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import BoardCategoryFormComponent from '@/pages/dashboard/board-category/components/BoardCategoryFormComponent.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'

const corePinia = useCore()
const boardCategoryPinia = useBoardCategory()

const { visibleDrawer, loadingUrl } = storeToRefs(corePinia)
const { categoriesTree } = storeToRefs(boardCategoryPinia)

const columns = ref([
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'title'
  },
  {
    title: 'ORDER_NUMBER',
    dataIndex: 'id',
    key: 'id',
    width: 70,
    align: 'center'
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    width: 100,
    align: 'center'
  }
])
const rowId = ref(null)

const canBeDeleted = (array) => array?.length > 0

function createNewCategory(id = null) {
  rowId.value = id
  visibleDrawer.value.add('board/category/create')
}

onMounted(() => {
  boardCategoryPinia.getAllBoardCategories()
})
</script>

<template>
  <page-header-component :title="$t('DashboardBoardCategoryListView')">
    <template #actions>
      <a-button @click="createNewCategory()" class="btn" type="primary">
        <IconPlus /> <span class="ml-1">{{ $t('ADD') }}</span>
      </a-button>
    </template>
  </page-header-component>
  <board-category-form-component v-model:id="rowId" />
  <loader-component loading-url="board/category/get/all">
    <a-table
      :data-source="categoriesTree"
      :columns="columns"
      :pagination="false"
      class="table-custom-class"
      :scroll="{ y: 'calc(100vh - 250px)' }"
      row-key="id"
      bordered
      size="middle"
    >
      <template #headerCell="{ column }">
        {{ $t(column.title) }}
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          {{ record.orderNumber }}
        </template>
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button
              @click="createNewCategory(record.id)"
              :loading="loadingUrl.has('board/category/create')"
              type="primary"
              class="btn"
            >
              <template #icon>
                <IconPlus />
              </template>
            </a-button>
            <a-button
              @click="boardCategoryPinia.deleteBoardCategory(record.id)"
              :disabled="canBeDeleted(record.children)"
              type="primary"
              class="btn"
              danger
              :loading="loadingUrl.has(`board/category/delete/${record.id}`)"
            >
              <template #icon>
                <IconTrash />
              </template>
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </loader-component>
</template>

<style scoped lang="scss"></style>
