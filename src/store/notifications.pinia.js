import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'
import { uniqueItems } from '@/composables/index.js'

const useNotifications = defineStore('notifications', {
  state: () => ({
    count: 0,
    newNotifications: [],
    notifications: [],
    totalPages: 0,
    oldNotifications: new Set([])
  }),
  actions: {
    getNotifications(page) {
      const core = useCore()
      core.loadingUrl.add('get/all/notifications')
      api({
        url: 'notification',
        params: {
          page: page,
          size: 6,
          isRead: null,
          type: 'MODERATOR'
        }
      })
        .then(({ data }) => {
          if (page === 0) {
            this.notifications.unshift(...data.content)
          }
          this.totalPages = data.totalPages
          this.notifications = [...this.notifications, ...data.content]
          this.notifications = uniqueItems(this.notifications, 'id')
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('get/all/notifications')
        })
    },
    getUnreadNotifications() {
      const core = useCore()
      core.loadingUrl.add('get/all/notifications')
      api({
        url: 'notification',
        params: {
          page: 0,
          size: 1000,
          isRead: false,
          type: 'MODERATOR'
        }
      })
        .then(({ data }) => {
          this.newNotifications = data.content.filter((item) => {
            if (!this.oldNotifications.has(item.id)) {
              this.oldNotifications.add(item.id)
              return item
            }
          })

          console.log(this.newNotifications)
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('get/all/notifications')
        })
    },
    checkNotifications() {
      const core = useCore()
      // core.loadingUrl.add('user/me')
      api({
        url: 'notification/count',
        params: {
          type: 'MODERATOR'
        }
      })
        .then(({ data }) => {
          this.count = data
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          // core.loadingUrl.delete('user/me')
        })
    },
    readNotification(id) {
      const core = useCore()
      // core.loadingUrl.add('user/me')
      api({
        url: 'notification',
        pk: id
      })
        .then(() => {
          this.notifications = this.notifications.map((item) => {
            if (item.id === id) item.read = true
            return item
          })
          this.count--
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          // core.loadingUrl.delete('user/me')
        })
    }
  }
})
export default useNotifications
