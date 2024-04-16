import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'
import { treeData, uniqueItems } from '@/composables/index.js'

const useBoardCategory = defineStore('board-category', {
  state: () => ({
    categories: [],
    categoriesTree: [],
    size: 5,
    totalElements: 0,
    totalPages: 1
  }),
  actions: {
    getAllBoardCategories() {
      const core = useCore()
      core.loadingUrl.add('board/category/get/all')
      api({
        url: 'board-category'
      })
        .then(({ data }) => {
          this.categories = [
            ...data.map((item) => ({
              id: item.id,
              value: item.id,
              title: item.name,
              order: item.orderNumber,
              pId: item.parentId
            }))
          ]
          this.categories = uniqueItems(this.categories, 'value')
          this.categoriesTree = treeData(data)
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('board/category/get/all')
        })
    },
    createBoardCategory(data, callback) {
      const core = useCore()
      core.loadingUrl.add('board/category/create')
      api({
        url: 'board-category',
        method: 'POST',
        data: data
      })
        .then(() => {
          callback()
          this.getAllBoardCategories()
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete(`board/category/create`)
        })
    },
    deleteBoardCategory(id) {
      const core = useCore()
      core.loadingUrl.add(`board/category/delete/${id}`)
      api({
        url: `board-category/${id}`,
        method: 'DELETE'
      })
        .then(() => {
          this.getAllBoardCategories()
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete(`board/category/delete/${id}`)
        })
    }
  }
})
export default useBoardCategory
