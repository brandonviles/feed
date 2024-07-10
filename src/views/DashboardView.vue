<template>
    <div>
      <div class="min-w-0 flex-1">
        <h2 v-if="selectedBaby" class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{{selectedBaby.name}}'s Dashboard</h2>
      </div>
      
        <div class="mt-8">
              <h1 class="text-base font-semibold leading-6 text-gray-900">Quick Stats</h1>
  
  
          <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <li class="col-span-1 flex rounded-md shadow-sm">
              <div class="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div class="flex-1 truncate px-4 py-2 text-sm">
                  <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Today's Goal</a>
                  <p class="text-gray-500">{{ totalDailyRequirement }} ml</p>
                </div>
                <div class="flex-shrink-0 pr-2">
                  <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span class="sr-only">Open options</span>
                    <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
            <li class="col-span-1 flex rounded-md shadow-sm">
              <div class="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div class="flex-1 truncate px-4 py-2 text-sm">
                  <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Amount fed today</a>
                  <p class="text-gray-500">{{ amountFedToday }} ml</p>
                </div>
                <div class="flex-shrink-0 pr-2">
                  <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span class="sr-only">Open options</span>
                    <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
            <li class="col-span-1 flex rounded-md shadow-sm">
              <div class="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div class="flex-1 truncate px-4 py-2 text-sm">
                  <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Pace</a>
                  <p class="text-gray-500">{{ amountNeededUntilNow }}</p>
                </div>
                <div class="flex-shrink-0 pr-2">
                  <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span class="sr-only">Open options</span>
                    <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
    </div>
  
  </template>
  
  <script setup>
  
  
  import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
  
  
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { XMarkIcon } from '@heroicons/vue/24/outline'
  
  const open = ref(false)

  import { useBabyStore } from '@/stores/babyStore'

const babyStore = useBabyStore()

const selectedBaby = computed(() => babyStore.selectedBaby)
  
  const newBabyName = ref('')
  const newBabyWeight = ref(null)
  const feedAmountInput = ref(null)
  const feedsSinceMidnight = ref([])
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
  
  const today = new Date();
  const dateString = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  const timeString = ref(`${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`);
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  
  const fetchFeeds = async () => {
    if (baby.value) {
      try {
        const response = await axios.get(`${serverUrl}/feeds/${baby.value.id}`)
        console.log('Fetched feeds:', response.data) // Debugging log
        feedsSinceMidnight.value = response.data.filter(feed => new Date(feed.timestamp) > todayMidnight);
  
        feeds.value = feedsSinceMidnight.value;
      } catch (error) {
        console.error('Error fetching feeds:', error)
        feeds.value = []
      }
    }
  }
  
  
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
    if (baby.value !== null && feedAmountInput.value) {
      try {
        await axios.post(`${serverUrl}/feeds`, {
          baby_id: baby.value.id,
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
    if (baby.value !== null) {
      try {
        await axios.delete(`${serverUrl}/feeds/${feedId}`)
        await fetchFeeds()
      } catch (error) {
        console.error('Error deleting feed:', error)
      }
    }
  }
  
  const updateBabyWeight = async () => {
    if (baby.value !== null) {
      try {
        await axios.put(`${serverUrl}/babies/${baby.value.id}`, {
          weight: baby.value.weight
        })
        await fetchBabies()
      } catch (error) {
        console.error('Error updating baby weight:', error)
      }
    }
  }
  
  const deletebaby = async () => {
    if (baby.value !== null) {
      try {
        await axios.delete(`${serverUrl}/babies/${baby.value.id}`)
        babyIndex.value = null
        await fetchBabies()
      } catch (error) {
        console.error('Error deleting baby:', error)
      }
    }
  }
  
  const totalDailyRequirement = computed(() => {
    if (baby.value) {
      return Math.round((((baby.value.weight / 1000) * 120) / 20) * 29.5735) // 20 calories per ounce, 1 ounce = 29.5735 ml
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
    const pace = Math.round(totalDailyRequirement.value * (hoursPassed / 24)) - amountFedToday.value
    if (pace < 0) {
          return `${Math.abs(pace)} ml ahead`;
        } else if (pace > 0) {
          return `${pace} ml behind`;
        } else {
          return 'On pace';
        }
  })
  
  const amountNeededForRestOfDay = computed(() => {
    return totalDailyRequirement.value - amountFedToday.value
  })
  
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const babyId = route.params.id
  
  let baby = ref(null)
  
  const fetchBaby = async () => {
    const response = await axios.get(`${serverUrl}/babies/${babyId}`)
    baby.value = response.data
    fetchFeeds()
  }
  
  const pages = [
    { name: 'Nutrition', href: '/feed/babies', current: true },
  ]
  
  onMounted(async () => {
    await fetchBaby()
  })
  </script>
  