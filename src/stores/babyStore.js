import { defineStore } from 'pinia'
import axios from 'axios'

const serverUrl = 'https://baby-feeding-tracker.onrender.com/api'

export const useBabyStore = defineStore('babyStore', {
  state: () => ({
    selectedBaby: null,
    babies: []
  }),
  actions: {
    async fetchBabies() {
      try {
        const response = await axios.get(`${serverUrl}/babies`)
        this.babies = response.data
      } catch (error) {
        console.error('Failed to fetch babies:', error)
      }
    },
    selectBaby(baby) {
      this.selectedBaby = baby
    }
  }
})
