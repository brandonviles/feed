import { createRouter, createWebHistory } from 'vue-router'

import { useBabyStore } from '@/stores/babyStore'

import NutritionView from './views/NutritionView.vue'
import DashboardView from './views/DashboardView.vue'
import SleepView from './views/SleepView.vue'
import DiaperView from './views/DiaperView.vue'
import GrowthView from './views/GrowthView.vue'
import SettingsView from './views/SettingsView.vue'
import NoBabySelected from './views/NoBabySelected.vue'

const routes = [
  { path: '/', component: NutritionView },
  {
    name: 'dashboard',
    path: '/baby/:id/dashboard',
    component: DashboardView,
    meta: { requiresBaby: true }
  },

  {
    name: 'nutrition',
    path: '/baby/:id/nutrition',
    component: NutritionView,
    meta: { requiresBaby: true }
  },
  { name: 'sleep', path: '/baby/:id/sleep', component: SleepView, meta: { requiresBaby: true } },
  { name: 'diaper', path: '/baby/:id/diaper', component: DiaperView, meta: { requiresBaby: true } },
  { name: 'growth', path: '/baby/:id/growth', component: GrowthView, meta: { requiresBaby: true } },
  {
    name: 'settings',
    path: '/baby/:id/settings',
    component: SettingsView,
    meta: { requiresBaby: true }
  },
  {
    name: 'no-baby-selected',
    path: '/no-baby-selected',
    component: NoBabySelected
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const babyStore = useBabyStore()
  if (to.meta.requiresBaby && !babyStore.selectedBaby) {
    next('/no-baby-selected')
  } else {
    next()
  }
})

export default router
