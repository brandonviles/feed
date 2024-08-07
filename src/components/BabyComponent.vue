<template>
  <div>
    <div class="min-w-0 flex-1">
      <h2
        v-if="selectedBaby"
        class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
      >
        {{ selectedBaby.name }}'s Nutrition
      </h2>
    </div>

    <div class="mt-8">
      <h1 class="text-base font-semibold leading-6 text-gray-900">Quick Stats</h1>

      <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <li class="col-span-1 flex rounded-md shadow-sm">
          <div
            class="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white"
          >
            <div class="flex-1 truncate px-4 py-2 text-sm">
              <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Today's Goal</a>
              <p class="text-gray-500">{{ totalDailyRequirement }} ml</p>
            </div>
            <div class="flex-shrink-0 pr-2">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Open options</span>
                <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </li>
        <li class="col-span-1 flex rounded-md shadow-sm">
          <div
            class="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white"
          >
            <div class="flex-1 truncate px-4 py-2 text-sm">
              <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Amount fed today</a>
              <p class="text-gray-500">{{ amountFedToday }} ml</p>
            </div>
            <div class="flex-shrink-0 pr-2">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Open options</span>
                <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </li>
        <li class="col-span-1 flex rounded-md shadow-sm">
          <div
            class="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white"
          >
            <div class="flex-1 truncate px-4 py-2 text-sm">
              <a href="#" class="font-medium text-gray-900 hover:text-gray-600">Pace</a>
              <p class="text-gray-500">{{ amountNeededUntilNow }}</p>
            </div>
            <div class="flex-shrink-0 pr-2">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Open options</span>
                <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Today's Feeds</h1>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            @click="open = true"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add feed
          </button>
        </div>
      </div>

      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table v-if="feeds" class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Time Finished
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Source
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="feed in feeds" :key="feed.id">
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      {{ moment(feed.timestamp).format('LT') }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ feed.amount }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ feed.amount }}
                    </td>
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <a href="#" class="text-indigo-600 hover:text-indigo-900"
                        >Edit<span class="sr-only">, {{ feed.id }}</span></a
                      >
                      |
                      <a
                        @click.prevent="deleteFeed(feed.id)"
                        href="#"
                        class="text-warning hover:text-indigo-900"
                        >Delete<span class="sr-only">, {{ feed.id }}</span></a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-50" @close="open = false">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <form
                    @submit.prevent="logFeed"
                    class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                  >
                    <div class="h-0 flex-1 overflow-y-auto">
                      <div class="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div class="flex items-center justify-between">
                          <DialogTitle class="text-base font-semibold leading-6 text-white"
                            >Add Feed</DialogTitle
                          >
                          <div class="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              class="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              @click="open = false"
                            >
                              <span class="absolute -inset-2.5" />
                              <span class="sr-only">Close panel</span>
                              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div class="mt-1">
                          <p class="text-sm text-indigo-300">Enter a new feed.</p>
                        </div>
                      </div>
                      <div class="flex flex-1 flex-col justify-between">
                        <div class="divide-y divide-gray-200 px-4 sm:px-6">
                          <div class="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                for="project-name"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Date:</label
                              >
                              <div class="mt-2">
                                <input
                                  v-model="dateString"
                                  type="date"
                                  name="project-name"
                                  id="project-name"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                for="project-name"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Time:</label
                              >
                              <div class="mt-2">
                                <input
                                  v-model="timeString"
                                  type="time"
                                  name="project-name"
                                  id="project-name"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                for="description"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Feed amount (ml):</label
                              >
                              <div class="mt-2">
                                <input
                                  v-model="feedAmountInput"
                                  type="text"
                                  name="project-name"
                                  id="project-name"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        @click="open = false"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const moment = inject('moment')

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const open = ref(false)

import { useBabyStore } from '@/stores/babyStore'
import { useFeedStore } from '@/stores/feedStore'

const babyStore = useBabyStore()
const feedStore = useFeedStore()

const selectedBaby = computed(() => babyStore.selectedBaby)
const feeds = computed(() => feedStore.feeds)

const fetchFeeds = async () => {
  if (selectedBaby.value) {
    await feedStore.fetchFeeds(selectedBaby.value.id)
  }
}

// Watch the selectedBaby computed property and fetch feeds accordingly
watch(selectedBaby, fetchFeeds, { immediate: true })

const newBabyName = ref('')
const newBabyWeight = ref(null)
const feedAmountInput = ref(null)
const feedsSinceMidnight = ref([])
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

const today = new Date()
const dateString = ref(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
)
const timeString = ref(
  `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
)
const todayMidnight = new Date()
todayMidnight.setHours(0, 0, 0, 0)

// const fetchFeeds = async () => {
//   if (baby.value) {
//     try {
//       const response = await axios.get(`${serverUrl}/feeds/${selectedBaby.value.id}`)
//       console.log('Fetched feeds:', response.data) // Debugging log
//       feedsSinceMidnight.value = response.data.filter(
//         (feed) => new Date(feed.timestamp) > todayMidnight
//       )

//       feeds.value = feedsSinceMidnight.value
//     } catch (error) {
//       console.error('Error fetching feeds:', error)
//       feeds.value = []
//     }
//   }
// }

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
      open.value = false
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
  const pace = Math.round(totalDailyRequirement.value * (hoursPassed / 24)) - amountFedToday.value
  if (pace < 0) {
    return `${Math.abs(pace)} ml ahead`
  } else if (pace > 0) {
    return `${pace} ml behind`
  } else {
    return 'On pace'
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
  selectedBaby.value = response.data
  if (selectedBaby.value) {
    fetchFeeds()
  }
}

const pages = [{ name: 'Nutrition', href: '/feed/babies', current: true }]

onMounted(async () => {
  await fetchBaby()
})
</script>
