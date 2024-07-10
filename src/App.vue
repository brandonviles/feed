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
  <div v-if="selectedBaby">
    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <router-link
                    :to="{ name: 'dashboard', params: { id: selectedBaby.id } }"
                    :class="[
                      router.currentRoute.value.name === 'dashboard'
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    ]"
                  >
                    <HomeIcon
                      :class="[
                        router.currentRoute.value.name === 'dashboard'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'nutrition', params: { id: selectedBaby.id } }"
                    :class="[
                      router.currentRoute.value.name === 'nutrition'
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    ]"
                  >
                    <UsersIcon
                      :class="[
                        router.currentRoute.value.name === 'nutrition'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    Nutrition
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'growth', params: { id: selectedBaby.id } }"
                    :class="[
                      router.currentRoute.value.name === 'growth'
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    ]"
                  >
                    <HomeIcon
                      :class="[
                        router.currentRoute.value.name === 'growth'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    Growth
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'diaper', params: { id: selectedBaby.id } }"
                    :class="[
                      router.currentRoute.value.name === 'diaper'
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    ]"
                  >
                    <HomeIcon
                      :class="[
                        router.currentRoute.value.name === 'diaper'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    Daiper
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'sleep', params: { id: selectedBaby.id } }"
                    :class="[
                      router.currentRoute.value.name === 'sleep'
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    ]"
                  >
                    <HomeIcon
                      :class="[
                        router.currentRoute.value.name === 'sleep'
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    Sleep
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="mt-auto">
              <RouterLink
                :to="{ name: 'settings', params: { id: selectedBaby.id } }"
                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <Cog6ToothIcon
                  class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                  aria-hidden="true"
                />
                Settings
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <HeaderComponent :navigation="navigation" :sidebarOpen="sidebarOpen" />

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <RouterView :key="$route.fullPath" />
        </div>
      </main>
    </div>
  </div>
  <NoBabySelected v-else />
</template>

<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
import NoBabySelected from './views/NoBabySelected.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useBabyStore } from '@/stores/babyStore'
const babyStore = useBabyStore()

const selectedBaby = computed(() => babyStore.selectedBaby)

import {
  CalendarIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Nutrition', href: '#', icon: UsersIcon, current: false },
  { name: 'Growth', href: '#', icon: PresentationChartLineIcon, current: false },
  { name: 'Diapers', href: '#', icon: CalendarIcon, current: false }
]

const sidebarOpen = ref(false)

const router = useRouter()

// const navigateToBaby = (babyId) => {
//   console.log('Navigating to baby:', babyId)
//   router.push({ name: router.currentRoute.value.name, params: { id: babyId } })
// }
</script>
