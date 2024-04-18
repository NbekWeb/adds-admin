<script setup>
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { tableIndex } from '@/composables/index.js'
import dayjs from 'dayjs'
import amount from '@/composables/amount.js'
import { useRoute, useRouter } from 'vue-router'
import useOrder from '@/store/order.pinia.js'
import useCore from '@/store/core.pinia.js'

const router = useRouter()
const route = useRoute()

const corePinia = useCore()
const orderPinia = useOrder()

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)
const pagination = computed(() => ({
  total: totalElements.value,
  current: currentPage.value,
  pageSize: size.value
}))

const columns = reactive([
  {
    title: 'INDEX',
    key: 'id',
    width: 40,
    align: 'center'
  },
  {
    title: 'CUSTOMER',
    key: 'customer'
  },
  {
    title: 'STATUS',
    key: 'status',
    width: 170
  },
  {
    title: 'CHANNELS_NUMBER',
    dataIndex: 'itemsAmount',
    key: 'itemsAmount',
    width: 120,
    align: 'center'
  },
  {
    title: 'DATE',
    dataIndex: 'createdDate',
    key: 'createdDate',
    width: 120,
    align: 'center'
  },
  {
    title: 'AMOUNT',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 120,
    align: 'center'
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    width: 100,
    align: 'center'
  }
])

const { visibleDrawer } = storeToRefs(corePinia)
const { orders, totalElements, size, totalPages } = storeToRefs(orderPinia)

function handleTableChange(pag) {
  router.push({
    query: {
      page: pag.current
    }
  })
  orderPinia.getAllOrders(currentPage.value - 1)
}
function viewPost(postId) {
  orderPinia.getPostById(postId)
  visibleDrawer.value.add('post/get/one')
}
</script>

<template>
  <loader-component loading-url="order/get/all">
    <a-table
      @change="handleTableChange"
      :columns="columns"
      bordered
      :data-source="orders"
      :pagination="totalPages > 1 ? pagination : false"
      row-key="username"
      size="middle"
      :scroll="{ y: 'calc(100vh - 250px)', x: 'max-content' }"
      class="table-custom-class"
    >
      <template #headerCell="{ column }">
        {{ $t(column.title) }}
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'id'">
          {{ tableIndex(index, totalElements, currentPage - 1, size) }}
        </template>
        <template v-if="column.key === 'customer'">
          {{ record.user.fullName }}
        </template>
        <template v-if="column.key === 'status'">
          <status-tag-component :status="record.status" />
        </template>
        <template v-if="column.key === 'createdDate'">
          {{ dayjs(record.createdDate).format('DD.MM.YYYY') }}
        </template>
        <template v-if="column.key === 'totalAmount'">
          {{ amount(record.totalAmount) }}
        </template>
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button class="btn" @click="viewPost(record.postId)">
              <template #icon>
                <IconMessageTextSquare />
              </template>
            </a-button>
            <a-button class="btn">
              <template #icon>
                <IconEye />
              </template>
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </loader-component>
</template>

<style scoped lang="scss"></style>
