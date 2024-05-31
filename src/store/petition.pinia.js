import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const usePetition = defineStore('petition', {
  state: () => ({
    petitions: [],
    totalElements: 0,
    totalPages: 1,
    page: 0,
    size: 10
  }),
  actions: {
    getAllKioskBoards(page) {
      const core = useCore()
      core.loadingUrl.add('petition')
      api({
        url: 'petition',
        params: {
          page,
          size: this.size
        }
      })
        .then(({ data }) => {
          this.totalPages = data.totalPages
          this.petitions = data.content
          this.totalElements = data.totalElements
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('petition')
        })
    }
  }
})
export default usePetition
