import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useKioskBoard = defineStore('kiosk-board', {
  state: () => ({
    statuses: [],
    boards: [],
    size: 8,
    totalElements: 0,
    totalPages: 1
  }),
  actions: {
    getAllKioskBoards(page, name = null, status = null, category = null) {
      const core = useCore()
      core.loadingUrl.add('kiosk-board/get/all')
      api({
        url: 'kiosk-board/dev',
        params: {
          page: page,
          size: this.size,
          categoryId: category,
          status: status,
          name: name
        }
      })
        .then(({ data }) => {
          this.boards = data.content
          this.totalElements = data.totalElements
          this.totalPages = data.totalPages
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('kiosk-board/get/all')
        })
    },
    getAllKioskBoardStatus() {
      const core = useCore()
      core.loadingUrl.add('board/status/get/all')
      api({
        url: 'board/status-list'
      })
        .then(({ data }) => {
          this.statuses = data
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('board/status/get/all')
        })
    },
    changeKioskBoardStatus(id, status, callback) {
      const core = useCore()
      core.loadingUrl.add('kiosk-board/status/update')
      api({
        url: `kiosk-board/dev/${id}`,
        method: 'PUT',
        data: {
          status: status
        }
      })
        .then(() => {
          core.setToast({
            type: 'success',
            locale: 'CHANNEL_STATUS_CHANGED_SUCCESSFULLY'
          })
          callback()
        })
        .catch((error) => {
          core.switchStatus(error)
        })
    }
  }
})
export default useKioskBoard
