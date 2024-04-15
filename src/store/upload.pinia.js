import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useUpload = defineStore('upload', {
  actions: {
    uploadFile(file, type = 'TELEGRAM', callback) {
      const core = useCore()
      const form_data = new FormData()
      form_data.append('file', file)
      core.loadingUrl.add('file/upload')
      api({
        url: `file/${type === 'TELEGRAM' ? 'telegram' : type === 'KIOSK' ? 'kiosk' : ''}`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: form_data
      })
        .then(({ data }) => {
          callback(data)
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('file/upload')
        })
    }
  }
})
export default useUpload
