<template>
  <div id="app">
    <h1>Baby Feeding Calculator</h1>
    <div>
      <div>
        <label for="babyName">Baby Name:</label>
        <input type="text" v-model="newBabyName" />
      </div>
      <div>
        <label for="babyWeight">Baby Weight (g):</label>
        <input type="number" v-model="newBabyWeight" step="1" />
      </div>
      <div>
        <button @click="addBaby">Add Baby</button>
      </div>
    </div>
    <div v-if="babies.length > 0">
      <label for="selectedBaby">Select Baby:</label>
      <select v-model="selectedBabyIndex">
        <option v-for="(baby, index) in babies" :key="index" :value="index">{{ baby.name }}</option>
      </select>
    </div>
    <div v-if="selectedBaby !== null">
      <h2>{{ selectedBaby.name }}</h2>
      <div>
        <label for="updatedBabyWeight">Update Baby Weight (g):</label>
        <input type="number" v-model="updatedBabyWeight" step="1" @change="updateBabyWeight" />
      </div>
      <div>
        <label for="feedAmount">Amount Fed (ml):</label>
        <input type="number" v-model="feedAmountInput" step="0.01" />
        <button @click="logFeed">Log Feed</button>
      </div>
      <div v-if="feedAmountNeeded !== null">
        <h2>Feed Amount Needed for the Rest of the Day: {{ feedAmountNeeded }} ml</h2>
      </div>
      <div v-if="amountLeftToFeed !== null">
        <h2>Feed Amount Needed Up to Now: {{ amountLeftToFeed }} ml</h2>
      </div>
      <div v-if="feedsSinceMidnight.length > 0">
        <h2>Feed Log Since Midnight:</h2>
        <ul>
          <li v-for="(feed, index) in feedsSinceMidnight" :key="feed.timestamp">
            {{ feed.amount }} ml at {{ new Date(feed.timestamp).toLocaleTimeString() }}
            <button @click="deleteFeed(index)">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'

const newBabyName = ref('')
const newBabyWeight = ref(null)
const feedAmountInput = ref(null)
const selectedBabyIndex = ref(null)
const updatedBabyWeight = ref(null)

const babies = ref([])

const selectedBaby = computed(() => {
  if (selectedBabyIndex.value !== null && babies.value.length > 0) {
    return babies.value[selectedBabyIndex.value]
  }
  return null
})

watch(selectedBabyIndex, () => {
  if (selectedBaby.value) {
    updatedBabyWeight.value = selectedBaby.value.weight
  }
})

const dailyFeedRequirementInMl = computed(() => {
  if (selectedBaby.value !== null && selectedBaby.value.weight) {
    const babyWeightInKg = selectedBaby.value.weight / 1000
    const dailyCalorieRequirement = 120 * babyWeightInKg
    const dailyFeedRequirementInOunces = dailyCalorieRequirement / 20
    return Math.round(dailyFeedRequirementInOunces * 29.5735)
  }
  return null
})

const feedRequirementUpToNow = computed(() => {
  if (dailyFeedRequirementInMl.value !== null && selectedBaby.value !== null) {
    const currentTime = new Date()
    const midnight = new Date(currentTime)
    midnight.setHours(0, 0, 0, 0)
    const timeElapsedSinceMidnightInHours = (currentTime - midnight) / (1000 * 60 * 60)
    const hourlyFeedRequirement = dailyFeedRequirementInMl.value / 24
    return Math.round(hourlyFeedRequirement * timeElapsedSinceMidnightInHours)
  }
  return null
})

const feedsSinceMidnight = computed(() => {
  if (selectedBaby.value !== null) {
    const midnight = new Date()
    midnight.setHours(0, 0, 0, 0)
    return selectedBaby.value.feeds.filter((feed) => new Date(feed.timestamp) >= midnight)
  }
  return []
})

const amountFedSinceMidnight = computed(() => {
  if (feedsSinceMidnight.value.length > 0) {
    return feedsSinceMidnight.value.reduce((total, feed) => total + parseFloat(feed.amount), 0)
  }
  return 0
})

const amountLeftToFeed = computed(() => {
  if (feedRequirementUpToNow.value !== null) {
    return Math.round(feedRequirementUpToNow.value - amountFedSinceMidnight.value)
  }
  return null
})

const feedAmountNeeded = computed(() => {
  if (dailyFeedRequirementInMl.value !== null) {
    return Math.round(dailyFeedRequirementInMl.value - amountFedSinceMidnight.value)
  }
  return null
})

const loadBabies = async () => {
  try {
    const response = await axios.get('https://baby-feeding-tracker.onrender.com/api/babies')
    babies.value = response.data.babies
  } catch (error) {
    console.error('Error loading babies:', error)
  }
}

onMounted(loadBabies)

const addBaby = async () => {
  if (newBabyName.value && newBabyWeight.value) {
    const baby = { name: newBabyName.value, weight: newBabyWeight.value, feeds: [] }
    try {
      await axios.post('https://baby-feeding-tracker.onrender.com/api/babies', baby)
      await loadBabies()
      newBabyName.value = ''
      newBabyWeight.value = null
      selectedBabyIndex.value = babies.value.length - 1
    } catch (error) {
      console.error('Error adding baby:', error)
    }
  }
}

const updateBabyWeight = async () => {
  if (selectedBaby.value !== null && updatedBabyWeight.value) {
    selectedBaby.value.weight = updatedBabyWeight.value
    try {
      await axios.post('https://baby-feeding-tracker.onrender.com//api/babies', selectedBaby.value)
      await loadBabies()
    } catch (error) {
      console.error('Error updating baby weight:', error)
    }
  }
}

const logFeed = async () => {
  if (selectedBaby.value !== null && feedAmountInput.value) {
    selectedBaby.value.feeds.push({ amount: feedAmountInput.value, timestamp: Date.now() })
    try {
      await axios.post('https://baby-feeding-tracker.onrender.com/api/babies', selectedBaby.value)
      await loadBabies()
      feedAmountInput.value = null
    } catch (error) {
      console.error('Error logging feed:', error)
    }
  }
}

const deleteFeed = async (index) => {
  if (selectedBaby.value !== null) {
    selectedBaby.value.feeds.splice(index, 1)
    try {
      await axios.post('https://baby-feeding-tracker.onrender.com/api/babies', selectedBaby.value)
      await loadBabies()
    } catch (error) {
      console.error('Error deleting feed:', error)
    }
  }
}

watch(babies, (newBabies) => {
  localStorage.setItem('babies', JSON.stringify(newBabies))
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
