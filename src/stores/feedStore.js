import { defineStore } from 'pinia'
import axios from 'axios'
import { startOfToday } from 'date-fns'

const serverUrl = 'https://baby-feeding-tracker.onrender.com/api'

export const useFeedStore = defineStore('feedStore', {
  state: () => ({
    feeds: []
  }),
  actions: {
    async fetchFeeds(babyId) {
      try {
        //todo: change api endpoint from /api/feeds/:baby_id to /api/babies/:baby_id/feeds
        const response = await axios.get(`${serverUrl}/feeds/${babyId}`)
        this.feeds = response.data
      } catch (error) {
        console.error('Failed to fetch feeds:', error)
        this.feeds = []
      }
    }
  },
  getters: {
    feedsSinceMidnight: (state) => {
      const todayMidnight = startOfToday()
      return state.feeds.filter((feed) => new Date(feed.timestamp) >= todayMidnight)
    }
  }
})
