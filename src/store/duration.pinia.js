import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useDuration = defineStore('duration', {
  state: () => ({
    duration: {}
  }),
  actions: {
    getDuration() {
      const core = useCore()
      core.loadingUrl.add('duration/get')
      api({
        url: 'duration-limit'
      })
        .then(({ data }) => {
          this.duration = data
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('duration/get')
        })
    },
    changeDuration(time) {
      const core = useCore()
      core.loadingUrl.add('duration/update')
      api({
        url: 'duration-limit',
        method: 'PUT',
        data: {
          limitSeconds: time?.limitSeconds,
          defaultImageSeconds: time?.defaultImageSeconds,
          defaultTextSeconds: time?.defaultTextSeconds
        }
      })
        .then(() => {
          core.setToast({
            type: 'success',
            locale: 'DURATION_CHANGED'
          })
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('duration/update')
        })
    }
  }
})
export default useDuration
