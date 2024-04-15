import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const useBoardCategory = defineStore('board-category', {
  state: () => ({
    categories: [],
    size: 8,
    totalElements: 0,
    totalPages: 1
  }),
  actions: {
    getAllBoardCategories(parentId = null, callback) {
      const core = useCore()
      core.loadingUrl.add('board/get/all')
      api({
        url: 'board-category',
        params: {
          parentId: parentId
        }
      })
        .then(({ data }) => {
          if (parentId) {
            callback(data)
          } else {
            this.categories = data.content
          }
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('board/get/all')
        })
    }
  }
})
export default useBoardCategory
