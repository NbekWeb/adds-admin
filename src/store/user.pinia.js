import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useUser = defineStore('user', {
  state: () => ({
    users: [],
    size: 8,
    totalElements: 0,
    totalPages: 1
  }),
  actions: {
    getAllUsers(page) {
      const core = useCore()
      core.loadingUrl.add('user/get/all')
      api({
        url: 'user',
        params: {
          page: page,
          size: this.size
        }
      })
        .then(({ data }) => {
          this.users = data.content
          this.totalElements = data.totalElements
          this.totalPages = data.totalPages
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('user/get/all')
        })
    },
    updateUser(form) {
      const core = useCore()
      core.loadingUrl.add('user/update')
      api({
        url: 'user',
        method: 'PUT',
        data: {
          fullName: form.fullName,
          phoneNumber: `998${form.username}`
        }
      })
        .then(() => {
          // this.getUserMe()
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('user/update')
        })
    },
    deleteUser(id, callback) {
      const core = useCore()
      core.loadingUrl.add(`user/delete/${id}`)
      api({
        url: `user/${id}`,
        method: 'DELETE'
      })
        .then(() => {
          callback()
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete(`user/delete/${id}`)
        })
    }
  }
})
export default useUser
