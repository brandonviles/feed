import { createRouter, createWebHistory } from 'vue-router'

import BabiesComponent from './components/BabiesComponent.vue'
import BabyComponent from './components/BabyComponent.vue'
import DashboardView from './views/DashboardView.vue'

const routes = [
  { path: '/', component: BabyComponent },
  { name: 'dashboard', path: '/baby/:id/dashboard', component: DashboardView },

  { name: 'nutrition', path: '/baby/:id/nutrition', component: BabyComponent }// dynamic route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
