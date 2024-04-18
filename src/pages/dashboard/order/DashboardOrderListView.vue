<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useOrder from '@/store/order.pinia.js'
import PageHeaderComponent from '@/components/PageHeaderComponent.vue'
import OrderTableComponent from '@/pages/dashboard/order/components/OrderTableComponent.vue'
import PostViewComponent from '@/pages/dashboard/order/components/PostViewComponent.vue'

const route = useRoute()

const orderPinia = useOrder()

const currentPage = computed(() =>
  route.query.page ? parseInt(route.query.page, 10) : 1
)

onMounted(() => {
  orderPinia.getAllOrders(currentPage.value - 1)
})
</script>

<template>
  <page-header-component :title="$t('DashboardOrderListView')">
  </page-header-component>
  <order-table-component />
  <post-view-component />
</template>

<style scoped lang="scss"></style>
