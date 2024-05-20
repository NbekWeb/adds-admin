<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import useOrder from '@/store/order.pinia.js'
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import OrderTableComponent from '@/pages/dashboard/order/components/OrderTableComponent.vue'
import PostViewComponent from '@/pages/dashboard/order/components/PostViewComponent.vue'

const route = useRoute()
const router = useRouter()

const orderPinia = useOrder()

const selectStatus = ref('')
const selectedChannel = ref('')

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

const handleChange = (val) => {
  router.push({ ...route.query, query: { channel: val } })
  if (selectStatus.value == 'all') {
    if (val == 'kiosk') {
      orderPinia.getAllOrdersKiosk(0)
    } else {
      orderPinia.getAllOrdersTelegram(0)
    }
  } else {
    if (val == 'kiosk') {
      orderPinia.getAllOrdersKiosk(0, selectStatus.value)
    } else {
      orderPinia.getAllOrdersTelegram(0, selectStatus.value)
    }
  }
}

const handleChangeStatus = (val) => {
  router.push({ ...route.query, query: { status: val } })
  if (val == 'all') {
    if (selectedChannel.value == 'kiosk') {
      orderPinia.getAllOrdersKiosk(0)
    } else {
      orderPinia.getAllOrdersTelegram(0)
    }
  } else {
    if (selectedChannel.value == 'kiosk') {
      orderPinia.getAllOrdersKiosk(0, selectStatus.value)
    } else {
      orderPinia.getAllOrdersTelegram(0, selectStatus.value)
    }
  }
}

watch(selectedChannel, (newChannel, oldChannel) => {
  if (newChannel !== oldChannel) {
    router.push({ query: { ...route.query, channel: newChannel } })
  }
})

watch(selectStatus, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus) {
    router.push({ query: { ...route.query, status: newStatus } })
  }
})

onMounted(() => {
  if (!route.query.channel) {
    router.push({ query: { channel: 'telegram' } })
  }

  selectedChannel.value = route.query.channel || 'telegram'
  selectStatus.value = route.query.status || 'all'

  if (selectStatus.value == 'all') {
    if (selectedChannel.value == 'kiosk') {
      orderPinia.getAllOrdersKiosk(0)
    } else {
      orderPinia.getAllOrdersTelegram(0)
    }
  } else {
    if (selectedChannel.value == 'kiosk') {
      orderPinia.getAllOrdersKiosk(0, selectStatus.value)
    } else {
      orderPinia.getAllOrdersTelegram(0, selectStatus.value)
    }
  }
})
orderPinia.getAllStatus()
</script>

<template>
  <div class="flex justify-between align-center mb-2">
    <page-header-component :title="$t('DashboardOrderListView')">
    </page-header-component>
    <div>
      <a-select
        style="width: 120px"
        v-model:value="selectedChannel"
        @change="handleChange"
      >
        <a-select-option value="telegram">Telegram</a-select-option>
        <a-select-option value="kiosk">Kiosk</a-select-option>
      </a-select>
      <a-select
        style="width: 250px"
        v-model:value="selectStatus"
        @change="handleChangeStatus"
        class="ml-3"
      >
        <a-select-option value="all"> {{ $t('ALL_STATUS') }}</a-select-option>
        <a-select-option
          v-for="(status, i) in orderPinia.statusAll"
          :key="i"
          :value="status.orderStatus"
          >{{ status.localName }}</a-select-option
        >
      </a-select>

    </div>
  </div>
  <order-table-component />
  <post-view-component />
</template>

<style scoped lang="scss"></style>
