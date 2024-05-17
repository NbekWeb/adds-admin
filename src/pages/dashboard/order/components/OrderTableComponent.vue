<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { tableIndex } from '@/composables/index.js'
import dayjs from 'dayjs'
import amount from '@/composables/amount.js'
import { useRoute, useRouter } from 'vue-router'
import useOrder from '@/store/order.pinia.js'
import useCore from '@/store/core.pinia.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import StatusTagComponent from '@/components/StatusTagComponent.vue'
import IconMessageTextSquare from '@/components/icons/IconMessageTextSquare.vue'
import IconEye from '@/components/icons/IconEye.vue'

const router = useRouter()
const route = useRoute()

const corePinia = useCore()
const orderPinia = useOrder()

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

const selectedChannel = ref(route.query.channel)

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
const statuses = ref([
  {
    label: 'APPROVE',
    value: 'APPROVED'
  },
  {
    label: 'REJECT',
    value: 'REJECTED_BY_MODERATOR'
  }
])

const pagination = computed(() => ({
  total: totalElements.value,
  current: currentPage.value,
  pageSize: size.value
}))

const { visibleDrawer } = storeToRefs(corePinia)
const { orders, totalElements, size, totalPages } = storeToRefs(orderPinia)

watch(()=>route.query.channel, (newValue) => {
  selectedChannel.value =  newValue
})

function handleTableChange(pag) {
  router.push({
    query: {
      page: pag.current,
      channel: selectedChannel.value
    }
  })
  if (selectedChannel.value == 'kiosk') {
    orderPinia.getAllOrdersKiosk(pag.current - 1)
  } else {
    orderPinia.getAllOrdersTelegram(pag.current - 1)
  }
}
function handleChangeStatus(id, status) {
  orderPinia.changeOrderStatus(id, status, () => {
    orderPinia.getAllOrders(currentPage.value - 1)
  })
}
function viewPost(postId) {
  console.log('on', selectedChannel.value)
  if (selectedChannel.value == 'kiosk') {
    orderPinia.getPostByIdKiosk(postId)
  } else {
    orderPinia.getPostByIdTelegram(postId)
  }
  visibleDrawer.value.add('post/get/one')
}
</script>

<template>
  <loader-component loading-url="order/get/all">
    {{ selectedChannel }}
    <a-table
      @change="handleTableChange"
      :columns="columns"
      bordered
      :data-source="orders"
      :pagination="totalPages > 1 ? pagination : false"
      row-key="username"
      size="middle"
      :scroll="{ y: 'calc(100vh - 310px)', x: 'max-content' }"
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
          <a-dropdown
            trigger="click"
            placement="bottom"
            arrow
            :disabled="record.status !== 'PENDING'"
          >
            <status-tag-component
              :class="{ pointer: record.status === 'PENDING' }"
              :status="record.status"
            />
            <template #overlay>
              <a-menu
                @click="(event) => handleChangeStatus(record.id, event.key)"
              >
                <a-menu-item v-for="status in statuses" :key="status.value">
                  {{ $t(status.label) }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-if="column.key === 'createdDate'">
          {{ dayjs(record.createdDate).format('DD.MM.YYYY') }}
        </template>
        <template v-if="column.key === 'totalAmount'">
          {{ amount(record.totalAmount) }}
        </template>
        <template v-if="column.key === 'actions'">
          <a-space>
            <a-button
              class="btn"
              @click="viewPost(record.postId, selectedChannel)"
            >
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
