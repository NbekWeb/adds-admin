<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { tableIndex } from '@/composables'
import useCore from '@/store/core.pinia.js'
import useKioskBoard from '@/store/kiosk-board.pinia.js'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import BoardStatusComponent from '@/pages/dashboard/kiosk-board/components/KioskBoardStatusComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'

const route = useRoute()
const router = useRouter()

const corePinia = useCore()
const boardPinia = useKioskBoard()

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
    key: 'name',
    width: 100
  },
  {
    title: 'OWNER',
    dataIndex: 'owner',
    key: 'owner',
    width: 200
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
    width: 500
  },
  {
    title: 'CATEGORY',
    dataIndex: 'category',
    key: 'category',
    width:200
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
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
  boardPinia.getAllKioskBoards(currentPage.value - 1)
}
function handleChangeStatus(id, status) {
  boardPinia.changeKioskBoardStatus(id, status, () => {
    boardPinia.getAllKioskBoards(currentPage.value - 1)
  })
}

onMounted(() => {
  boardPinia.getAllKioskBoards(currentPage.value - 1)
  boardPinia.getAllKioskBoardStatus()
})
</script>

<template>
  <loader-component loading-url="kiosk-board/get/all">
    <a-table
      @change="handleTableChange"
      :columns="columns"
      bordered
      :data-source="boards"
      :loading="loadingUrl.has('kiosk-board/all')"
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
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-if="column.key === 'owner'">
          {{ record.owner.fullName }}
        </template>
        <template v-if="column.key === 'description'">
          <a-popover title="Description" placement="top" >
            <template #content>
              <p class="description-content">
                {{ record.description }}
              </p>
            </template>
            <p class="description">
              {{ record.description }} 
            </p>
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
  width: 800px;
}
</style>
