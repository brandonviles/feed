import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import moment from 'moment'
import router from './router.js'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.provide('moment', moment)
app.use(pinia)
app.use(router)
app.mount('#app')
