import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useOrder = defineStore('order', {
  state: () => ({
    orders: [],
    size: 8,
    totalElements: 0,
    totalPages: 1,
    post: null
  }),
  actions: {
    clearPost() {
      this.post = null
    },
    getAllOrders(page, status = null) {
      const core = useCore()
      core.loadingUrl.add('order/get/all')
      api({
        url: 'order/dev',
        params: {
          page: page,
          size: this.size,
          status: status
        }
      })
        .then(({ data }) => {
          this.orders = data.content
          this.totalElements = data.totalElements
          this.totalPages = data.totalPages
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('order/get/all')
        })
    },
    getPostById(id) {
      const core = useCore()
      core.loadingUrl.add('post/get/one')
      api({
        url: `post/${id}`
      })
        .then(({ data }) => {
          this.post = data
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('post/get/one')
        })
    },
    changeOrderStatus(id, status, callback) {
      const core = useCore()
      core.loadingUrl.add('order/status/update')
      api({
        url: `order/approve/${id}`,
        method: 'POST',
        data: {
          status: status
        }
      })
        .then(() => {
          callback()
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('order/status/update')
        })
    }
  }
})
export default useOrder
