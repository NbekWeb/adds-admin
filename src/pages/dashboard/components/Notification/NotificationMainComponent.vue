<script setup>
import IconBell from '@/components/icons/IconBell.vue'
import { onMounted, ref, watch } from 'vue'
import useNotifications from '@/store/notifications.pinia.js'
import { storeToRefs } from 'pinia'
import { notification } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import NotificationItem from '@/pages/dashboard/components/Notification/NotificationItem.vue'
import ScrollbarComponent from '@/components/ScrollbarComponent.vue'
import useCore from '@/store/core.pinia.js'

const { t } = useI18n()

const corePinia = useCore()
const notificationPinia = useNotifications()
const { loadingUrl } = storeToRefs(corePinia)
const { notifications, totalPages, count, newNotifications } =
  storeToRefs(notificationPinia)

const currentPage = ref(0)
const open = ref(false)
const timeOut = ref()
const openNotification = async () => {
  newNotifications.value.forEach((item, index) => {
    timeOut.value = setTimeout(() => {
      notification.open({
        message: t('NOTIFICATIONS'),
        description: item.message,
        placement: 'topRight',
        duration: 10
      })
    }, index * 1000)
  })
}
function checkNotifications() {
  notificationPinia.checkNotifications()
}
watch(newNotifications, () => {
  openNotification()
})
watch(count, () => {
  if (count.value) {
    notificationPinia.getNotifications(0)
    notificationPinia.getUnreadNotifications()
  }
})
function getPegableNotifications(page) {
  notificationPinia.getNotifications(page)
  currentPage.value = page
}

onMounted(() => {
  notificationPinia.getUnreadNotifications()
  notificationPinia.getNotifications(0)
  checkNotifications()
  setInterval(checkNotifications, 60000)
})
</script>

<template>
  <a-popover
    :title="$t('NOTIFICATIONS')"
    placement="bottomLeft"
    trigger="click"
    v-model:open="open"
  >
    <template #content>
      <div class="notification-content">
        <scrollbar-component
          height="calc(100vh - 200px)"
          :page="currentPage"
          :total-pages="totalPages"
          :loading="loadingUrl.has('get/all/notifications')"
          @get-data="getPegableNotifications"
        >
          <template #content>
            <template v-if="notifications.length">
              <notification-item
                v-for="(item, index) in notifications"
                :notification="item"
                :key="index"
                v-model:open="open"
              />
            </template>
            <template v-else>
              <div class="h-full flex align-center justify-center">
                <a-empty :description="$t('NO_NOTIFICATIONS')" />
              </div>
            </template>
          </template>
        </scrollbar-component>
      </div>
    </template>
    <a-badge class="badge-count" :count="count">
      <a-button
        shape="circle"
        type="text"
        class="btn notification-btn text-2xl"
        @click="open = true"
      >
        <template #icon>
          <IconBell />
        </template>
      </a-button>
    </a-badge>
  </a-popover>
</template>

<style scoped lang="scss">
.notification-content {
  min-width: 400px;
  max-width: 300px;
  min-height: 200px;
}
.badge-count {
  &:deep(.ant-badge-count) {
    background-color: #0020c2;
  }
}
</style>
