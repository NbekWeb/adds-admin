import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useUser = defineStore('user', {
  state: () => ({
    users: [],
    page: 0,
    size: 8,
    totalElements: 0,
    totalPages: 1,
    form: {
      id: null,
      fullName: null,
      username: null,
      role: null,
      password: null
    }
  }),
  actions: {
    clearForm() {
      this.form.fullName = null
      this.form.username = null
      this.form.role = null
      this.form.password = null
    },
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
    getUserById(id) {
      const core = useCore()
      core.loadingUrl.add('user/get/one')
      api({
        url: `user/${id}`
      })
        .then(({ data }) => {
          this.form = data
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('user/get/one')
        })
    },
    updateUser(id, callback) {
      const core = useCore()
      core.loadingUrl.add('user/update')

      api({
        url: `user/admin/${id}`,
        method: 'PUT',
        data: {
          fullName: this.form.fullName,
          username:
            this.form.role === 'USER'
              ? `998${this.form.username}`
              : this.form.username,
          role: this.form.role,
          password: this.form.password
        }
      })
        .then(() => {
          callback()
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
