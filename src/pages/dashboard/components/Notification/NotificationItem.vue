<script setup>
import dayjs from 'dayjs'
import useNotifications from '@/store/notifications.pinia.js'
import { useRouter } from 'vue-router'
import IconBell from '@/components/icons/IconBell.vue'
import useCore from '@/store/core.pinia.js'

const model = defineModel('open')
const props = defineProps({
  notification: { type: Object, required: true }
})
const router = useRouter()

const corePinia = useCore()
const notificationPinia = useNotifications()

function handleReadNotification() {
  if (!props.notification.read) {
    notificationPinia.readNotification(props.notification.id)
    notificationPinia.checkNotifications(() => {})
    model.value = false
    router.push({
      name: 'DashboardOrderItemView',
      params: {
        id: props.notification?.itemId
      }
    })
  }
}
</script>

<template>
  <a-card @click="handleReadNotification" class="notification-card">
    <div class="flex">
      <div class="text-lg mr-3">
        <a-avatar
          :class="{ unread: !notification?.read }"
          class="flex align-center justify-center"
        >
          <template #icon>
            <icon-bell />
          </template>
        </a-avatar>
      </div>
      <div class="notification-message">
        <p class="m-0 text-sm">{{ notification?.message }}</p>
        <div class="flex justify-between align-center">
          <span class="notification-date text-muted text-xs">
            {{ dayjs(notification?.date).format('DD.MM.YYYY, HH:mm') }}
          </span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';

.notification-card {
  cursor: pointer;
  border-color: transparent;
  border-bottom-color: rgb($muted, 0.2);
  border-radius: 0;

  //background-color: rgb($light, 0.5);
  &:hover {
    background-color: rgb($light, 0.2);
  }
  &:deep(.ant-card-body) {
    padding: 12px !important;
    padding-left: 0 !important;
  }
}
.unread {
  background-color: $primary;
}
.notification-message {
  p {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
//.notification-date{
//
//}
</style>
