<template>
  <div id="app">
    <h1>Baby Feeding Tracker</h1>
    <div>
      <label for="baby-name">Baby Name:</label>
      <input v-model="newBabyName" id="baby-name" />
      <label for="baby-weight">Baby Weight (grams):</label>
      <input type="number" v-model.number="newBabyWeight" id="baby-weight" />
      <button @click="addBaby">Add Baby</button>
    </div>
    <div v-if="babies.length > 0">
      <label for="selectedBaby">Select Baby:</label>
      <select v-model="selectedBabyIndex">
        <option v-for="(baby, index) in babies" :key="index" :value="index">{{ baby.name }}</option>
      </select>
      <button @click="deleteSelectedBaby">Delete Selected Baby</button>
    </div>
    <div v-if="selectedBaby">
      <h2>{{ selectedBaby.name }}</h2>
      <div>
        <label for="baby-weight-update">Update Weight (grams):</label>
        <input
          type="number"
          v-model.number="selectedBaby.weight"
          id="baby-weight-update"
          @change="updateBabyWeight"
        />
      </div>
      <div>
        <label for="feed-amount">Feed Amount (ml):</label>
        <input type="number" v-model.number="feedAmountInput" id="feed-amount" />
        <button @click="logFeed">Log Feed</button>
      </div>
      <div>
        <h3>Feeds</h3>
        <ul>
          <li v-for="(feed, index) in selectedBaby.feeds" :key="index">
            {{ new Date(feed.timestamp).toLocaleString() }}: {{ feed.amount }} ml
            <button @click="deleteFeed(feed.id)">Delete</button>
          </li>
        </ul>
      </div>
      <div>
        <h3>Daily Summary</h3>
        <p>Total Daily Requirement: {{ totalDailyRequirement }} ml</p>
        <p>Amount Fed Today: {{ amountFedToday }} ml</p>
        <p>Amount Needed for Rest of the Day: {{ amountNeededForRestOfDay }} ml</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const newBabyName = ref('')
const newBabyWeight = ref(null)
const selectedBabyIndex = ref(null)
const feedAmountInput = ref(null)
const babies = ref([])

const serverUrl = 'https://baby-feeding-tracker.onrender.com/api'

const fetchBabies = async () => {
  try {
    const response = await axios.get(`${serverUrl}/babies`)
    console.log('Fetched babies:', response.data) // Debugging log
    babies.value = response.data
  } catch (error) {
    console.error('Error fetching babies:', error)
  }
}

const fetchFeeds = async (babyId) => {
  try {
    const response = await axios.get(`${serverUrl}/feeds/${babyId}`)
    console.log('Fetched feeds:', response.data) // Debugging log
    return response.data
  } catch (error) {
    console.error('Error fetching feeds:', error)
    return []
  }
}

const selectedBaby = computed(() => {
  if (selectedBabyIndex.value !== null) {
    const baby = babies.value[selectedBabyIndex.value]
    console.log('Selected baby:', baby) // Debugging log
    return baby
  }
  return null
})

const addBaby = async () => {
  if (newBabyName.value && newBabyWeight.value) {
    try {
      await axios.post(`${serverUrl}/babies`, {
        name: newBabyName.value,
        weight: newBabyWeight.value
      })
      newBabyName.value = ''
      newBabyWeight.value = null
      await fetchBabies()
    } catch (error) {
      console.error('Error adding baby:', error)
    }
  }
}

const logFeed = async () => {
  if (selectedBaby.value !== null && feedAmountInput.value) {
    try {
      await axios.post(`${serverUrl}/feeds`, {
        baby_id: selectedBaby.value.id,
        amount: feedAmountInput.value
      })
      feedAmountInput.value = null
      selectedBaby.value.feeds = await fetchFeeds(selectedBaby.value.id)
    } catch (error) {
      console.error('Error logging feed:', error)
    }
  }
}

const deleteFeed = async (feedId) => {
  if (selectedBaby.value !== null) {
    try {
      await axios.delete(`${serverUrl}/feeds/${feedId}`)
      selectedBaby.value.feeds = await fetchFeeds(selectedBaby.value.id)
    } catch (error) {
      console.error('Error deleting feed:', error)
    }
  }
}

const updateBabyWeight = async () => {
  if (selectedBaby.value !== null) {
    try {
      await axios.post(`${serverUrl}/babies`, {
        id: selectedBaby.value.id,
        weight: selectedBaby.value.weight
      })
      await fetchBabies()
    } catch (error) {
      console.error('Error updating baby weight:', error)
    }
  }
}

const deleteSelectedBaby = async () => {
  if (selectedBaby.value !== null) {
    try {
      await axios.delete(`${serverUrl}/babies/${selectedBaby.value.id}`)
      selectedBabyIndex.value = null
      await fetchBabies()
    } catch (error) {
      console.error('Error deleting baby:', error)
    }
  }
}

const totalDailyRequirement = computed(() => {
  if (selectedBaby.value) {
    return Math.round((((selectedBaby.value.weight / 1000) * 120) / 20) * (1 / 0.033814))
  }
  return 0
})

const amountFedToday = computed(() => {
  if (selectedBaby.value) {
    const midnight = new Date()
    midnight.setHours(0, 0, 0, 0)
    return selectedBaby.value.feeds
      .filter((feed) => new Date(feed.timestamp) >= midnight)
      .reduce((total, feed) => total + feed.amount, 0)
  }
  return 0
})

const amountNeededForRestOfDay = ref(0)

const updateAmountNeededForRestOfDay = () => {
  amountNeededForRestOfDay.value = totalDailyRequirement.value - amountFedToday.value
}

watch([totalDailyRequirement, amountFedToday], updateAmountNeededForRestOfDay)

onMounted(async () => {
  await fetchBabies()
  updateAmountNeededForRestOfDay()
  const interval = setInterval(updateAmountNeededForRestOfDay, 60000) // Update every minute
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}

div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  padding: 5px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

button:hover {
  background-color: #369c77;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  text-align: left;
  margin-bottom: 10px;
}
</style>
