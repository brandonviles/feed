import { defineStore } from 'pinia'
import axios from 'axios'

const serverUrl = 'https://baby-feeding-tracker.onrender.com/api'

export const useGrowthStore = defineStore('growthStore', {
  state: () => ({
    weights: []
  }),
  actions: {
    async fetchWeights(babyId) {
      try {
        //todo: change api endpoint from /api/growths/:baby_id to /api/babies/:baby_id/growths
        const response = await axios.get(`${serverUrl}/babies/${babyId}/weights`)
        this.weights = response.data
      } catch (error) {
        console.error('Failed to fetch weights:', error)
        this.weights = []
      }
    }
  }
})
