<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useOrder from '@/store/order.pinia.js'
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import OrderTableComponent from '@/pages/dashboard/order/components/OrderTableComponent.vue'
import PostViewComponent from '@/pages/dashboard/order/components/PostViewComponent.vue'

const route = useRoute()
const router = useRouter()

const orderPinia = useOrder()

const selectStatus = ref(route.query.status)
const selectedChannel = computed(() => route.query.channel || 'telegram')

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

const handleChange = (val) => {
  router.push({ ...route.query, query: { channel: val } })
  if (val == 'kiosk') {
    orderPinia.getAllOrdersKiosk(0, selectStatus.value)
  } else {
    orderPinia.getAllOrdersTelegram(0, selectStatus.value)
  }
}

const handleChangeStatus = (val) => {
  router.push({ ...route.query, query: { status: val } })
  if (selectedChannel.value == 'kiosk') {
    orderPinia.getAllOrdersKiosk(0, selectStatus.value)
  } else {
    orderPinia.getAllOrdersTelegram(0, selectStatus.value)
  }
}

onMounted(() => {
  orderPinia.getAllStatus()
  if (selectedChannel.value == 'kiosk') {
    orderPinia.getAllOrdersKiosk(0, selectStatus.value)
  } else {
    orderPinia.getAllOrdersTelegram(0, selectStatus.value)
  }
})
</script>

<template>
  <div class="flex justify-between align-center mb-2">
    <page-header-component :title="$t('DashboardOrderListView')">
    </page-header-component>
    <div>
      <a-select
        style="width: 120px"
        :value="selectedChannel"
        @change="handleChange"
      >
        <a-select-option value="telegram">Telegram</a-select-option>
        <a-select-option value="kiosk">Kiosk</a-select-option>
      </a-select>
      <a-select
        :placeholder="$t('FILTER_BY_STATUS')"
        allow-clear
        style="width: 250px"
        v-model:value="selectStatus"
        @change="handleChangeStatus"
        class="ml-3"
      >
        <a-select-option
          v-for="(status, i) in orderPinia.statusAll"
          :key="i"
          :value="status.orderStatus"
          >{{ status.localName }}
        </a-select-option>
      </a-select>
    </div>
  </div>
  <order-table-component />
  <post-view-component />
</template>

<style scoped lang="scss"></style>
