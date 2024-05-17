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

const selectedChannel = ref('')

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

const handleChange = (val) => {
  console.log('val: ', val)
  router.push({ query: { channel: val } })
  if (val == 'kiosk') {
    orderPinia.getAllOrdersKiosk(0)
  } else {
    orderPinia.getAllOrdersTelegram(0)
  }
}

watch(selectedChannel, (newChannel, oldChannel) => {
  if (newChannel !== oldChannel) {
    router.push({ query: { channel: newChannel } })
  }
})

onMounted(() => {
  if (!router.currentRoute.value.query.channel) {
    router.push({ query: { channel: 'telegram' } })
  }
  selectedChannel.value = route.query.channel || 'telegram'
  if (selectedChannel.value == 'kiosk') {
    orderPinia.getAllOrdersKiosk()
  } else {
    orderPinia.getAllOrdersTelegram()
  }
})
</script>

<template>
  <div class="flex justify-between align-center mb-2">
    <page-header-component :title="$t('DashboardOrderListView')">
    </page-header-component>
    <a-select
      style="width: 120px"
      v-model:value="selectedChannel"
      @change="handleChange"
    >
      <a-select-option value="telegram">Telegram</a-select-option>
      <a-select-option value="kiosk">Kiosk</a-select-option>
    </a-select>
  </div>
  <order-table-component />
  <post-view-component />
</template>

<style scoped lang="scss"></style>
