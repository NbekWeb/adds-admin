import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useAuth = defineStore('auth', {
  state: () => ({
    user: {
      id: null,
      username: null,
      firstName: null,
      lastName: null,
      balance: 0
    }
  }),
  actions: {
    getUserMe() {
      const core = useCore()
      core.loadingUrl.add('user/me')
      api({
        url: 'user/me'
      })
        .then(({ data }) => {
          this.user = data
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('user/me')
        })
    },
    login(data) {
      const core = useCore()
      core.loadingUrl.add('auth/login')
      api({
        url: 'auth',
        method: 'POST',
        data: {
          grantType: 'password',
          ...data
        }
      })
        .then(({ data }) => {
          localStorage.setItem('access_token', data.accessToken)
          localStorage.setItem('refresh_token', data.refreshToken)
          core.redirect('/dashboard')
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('auth/login')
        })
    }
  }
})
export default useAuth
