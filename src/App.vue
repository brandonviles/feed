<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div>
    

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                
                <li>
                  <router-link :to="{ name: 'dashboard', params: { id: selected.id } }" :class="[router.currentRoute.value.name === 'dashboard' ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                    <HomeIcon :class="[router.currentRoute.value.name === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                    Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'nutrition', params: { id: selected.id } }" :class="[router.currentRoute.value.name === 'nutrition' ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                    <UsersIcon :class="[router.currentRoute.value.name === 'nutrition' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                    Nutrition
                  </router-link>
                </li>
              </ul>
            </li>
            
            <li class="mt-auto">
              <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                <Cog6ToothIcon class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <HeaderComponent :navigation="navigation" :sidebarOpen="sidebarOpen" />

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <RouterView  :key="$route.fullPath" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'


const selected = ref([])

import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Nutrition', href: '#', icon: UsersIcon, current: false },
  { name: 'Growth', href: '#', icon: PresentationChartLineIcon, current: false },
  { name: 'Diapers', href: '#', icon: CalendarIcon, current: false },
]



const sidebarOpen = ref(false)


import axios from 'axios'
const serverUrl = 'https://baby-feeding-tracker.onrender.com/api'


const babies = ref([])
const router = useRouter();
const fetchBabies = async () => {
  try {
    const response = await axios.get(`${serverUrl}/babies`)
    console.log('Fetched babies:', response.data) // Debugging log
    babies.value = response.data
    console.log('Selected baby:', router.currentRoute.value.params.id)
    let list = response.data
    var elementPos = list.map(function(x) {return x.id; }).indexOf(Number(router.currentRoute.value.params.id));
    console.log('Element position:', elementPos)
    let selectedBaby = list.find(baby => baby.id == router.currentRoute.value.params.id)
    if (selectedBaby) {
      selected.value = babies.value[elementPos]
      console.log('Selected baby:', selected.value)
    } else {
      console.log('No baby found with the given id')
    }
  } catch (error) {
    console.error('Error fetching babies:', error)
  }
}



const navigateToBaby = (babyId) => {
  console.log('Navigating to baby:', babyId)
  router.push({ name: router.currentRoute.value.name, params: { id: babyId } });
};




onMounted(async () => {
  await fetchBabies()
})
</script>