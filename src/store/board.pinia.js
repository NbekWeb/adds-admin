import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useBoard = defineStore('board', {
  state: () => ({
    statuses: [],
    boards: [],
    size: 8,
    totalElements: 0,
    totalPages: 1
  }),
  actions: {
    getAllBoards(page, name = null, status = null, category = null) {
      const core = useCore()
      core.loadingUrl.add('board/get/all')
      api({
        url: 'board/dev',
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
          core.loadingUrl.delete('board/get/all')
        })
    },
    getAllBoardStatus() {
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
    changeBoardStatus(id, status, callback) {
      const core = useCore()
      core.loadingUrl.add('board/status/update')
      api({
        url: `board/update-status/${id}`,
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
export default useBoard
