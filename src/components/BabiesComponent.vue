<template>
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol role="list" class="flex items-center space-x-4">
          <li>
            <div>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span class="sr-only">Home</span>
              </a>
            </div>
          </li>
          <li v-for="page in pages" :key="page.name">
            <div class="flex items-center">
              <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              <a
                :href="page.href"
                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                :aria-current="page.current ? 'page' : undefined"
                >{{ page.name }}</a
              >
            </div>
          </li>
        </ol>
      </nav>

      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Babies</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Age
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Weight
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Breastmilk Requirement
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="baby in babies" :key="baby.id">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                  >
                    <router-link :to="`/feed/babies/${baby.id}`">{{ baby.name }}</router-link>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ baby.title }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ baby.email }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ baby.role }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                    |
                    <a href="#" class="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
</template>

<script setup>
const pages = [{ name: 'Babies', href: '#', current: true }]

import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/20/solid'

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const newBabyName = ref('')
const newBabyWeight = ref(null)
const selectedBabyIndex = ref(null)
const feedAmountInput = ref(null)
const babies = ref([])
const feeds = ref([])

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

const fetchFeeds = async () => {
  if (selectedBaby.value) {
    try {
      const response = await axios.get(`${serverUrl}/feeds/${selectedBaby.value.id}`)
      console.log('Fetched feeds:', response.data) // Debugging log
      feeds.value = response.data
    } catch (error) {
      console.error('Error fetching feeds:', error)
      feeds.value = []
    }
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
      await fetchFeeds()
    } catch (error) {
      console.error('Error logging feed:', error)
    }
  }
}

const deleteFeed = async (feedId) => {
  if (selectedBaby.value !== null) {
    try {
      await axios.delete(`${serverUrl}/feeds/${feedId}`)
      await fetchFeeds()
    } catch (error) {
      console.error('Error deleting feed:', error)
    }
  }
}

const updateBabyWeight = async () => {
  if (selectedBaby.value !== null) {
    try {
      await axios.put(`${serverUrl}/babies/${selectedBaby.value.id}`, {
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
    return Math.round((((selectedBaby.value.weight / 1000) * 120) / 20) * 29.5735) // 20 calories per ounce, 1 ounce = 29.5735 ml
  }
  return 0
})

const amountFedToday = computed(() => {
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)
  return feeds.value
    .filter((feed) => new Date(feed.timestamp) >= midnight)
    .reduce((total, feed) => total + feed.amount, 0)
})

const amountNeededUntilNow = computed(() => {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)
  const hoursPassed = (now - midnight) / (1000 * 60 * 60)
  return Math.round(totalDailyRequirement.value * (hoursPassed / 24)) - amountFedToday.value
})

const amountNeededForRestOfDay = computed(() => {
  return totalDailyRequirement.value - amountFedToday.value
})

onMounted(async () => {
  await fetchBabies()
})
</script>
