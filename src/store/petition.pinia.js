import { defineStore } from 'pinia'
import { api } from '@/utils/api/index.js'
import useCore from '@/store/core.pinia.js'

const usePetition = defineStore('petition', {
  state: () => ({
    petitions: [],
    size: 8,
    totalElements: 0,
    totalPages: 1
  }),
  actions: {
    getAllKioskBoards(page) {
      const core = useCore()
      core.loadingUrl.add('petition')
      api({
        url: 'petition',
        params: {
          page: page
        }
      })
        .then(({ data }) => {
          this.petitions = data.content
        })
        .catch((error) => {
          core.switchStatus(error)
        })
        .finally(() => {
          core.loadingUrl.delete('petition')
        })
    },
  }
})
export default usePetition
