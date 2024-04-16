<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { tableIndex } from '@/composables'
import useCore from '@/store/core.pinia.js'
import useBoard from '@/store/board.pinia.js'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import BoardStatusComponent from '@/pages/dashboard/board/components/BoardStatusComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'

const route = useRoute()
const router = useRouter()

const corePinia = useCore()
const boardPinia = useBoard()

const { statuses, boards, totalElements, totalPages, size } =
  storeToRefs(boardPinia)
const { loadingUrl } = storeToRefs(corePinia)

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

const columns = ref([
  {
    title: 'INDEX',
    dataIndex: 'id',
    key: 'id',
    width: 40
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
    width: 300
  },
  {
    title: 'CATEGORY',
    dataIndex: 'category',
    key: 'category'
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'ACTIONS',
    key: 'action',
    width: 100,
    align: 'center'
  }
])
const pagination = computed(() => ({
  total: totalElements.value,
  current: currentPage.value,
  pageSize: size.value
}))

function handleTableChange(pag) {
  router.push({
    query: {
      page: pag.current
    }
  })
  boardPinia.getAllBoards(currentPage.value - 1)
}
function handleChangeStatus(id, status) {
  boardPinia.changeBoardStatus(id, status, () => {
    boardPinia.getAllBoards(currentPage.value - 1)
  })
}
</script>

<template>
  <loader-component loading-url="board/get/all">
    <a-table
      @change="handleTableChange"
      :columns="columns"
      bordered
      :data-source="boards"
      :loading="loadingUrl.has('user/get/all')"
      :pagination="totalPages > 1 ? pagination : false"
      row-key="username"
      size="middle"
      class="table-custom-class"
    >
      <template #headerCell="{ column }">
        {{ $t(column.title) }}
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'id'">
          {{ tableIndex(index, totalElements, currentPage - 1, size) }}
        </template>

        <template v-if="column.key === 'description'">
          <a-popover title="Description">
            <template #content>
              <p class="description-content">
                {{ record.description }}
              </p>
            </template>
            <span class="description">
              {{ record.description }}
            </span>
          </a-popover>
        </template>
        <template v-if="column.key === 'category'">
          <span class="category">
            {{ record.category.name }}
          </span>
        </template>
        <template v-if="column.key === 'status'">
          <a-dropdown trigger="click" placement="bottom" arrow>
            <board-status-component :status="record.status.boardStatus" />
            <template #overlay>
              <a-menu
                @click="(event) => handleChangeStatus(record.id, event.key)"
              >
                <a-menu-item
                  v-for="status in statuses"
                  :key="status.boardStatus"
                >
                  {{ status.localName }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

        <template v-if="column.key === 'action'">
          <a-space>
            <a-button class="btn" type="primary" size="middle">
              <template #icon>
                <IconEdit />
              </template>
            </a-button>
            <a-button class="btn" type="primary" size="middle" danger>
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

<style scoped lang="scss">
.description,
.category {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.description-content {
  width: 300px;
}
</style>
