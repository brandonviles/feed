import './styles.css'

import { createApp } from 'vue'

import moment from 'moment'
import router from './router.js'
import App from './App.vue'


const app = createApp(App)
app.provide('moment', moment);
app.use(router)
app.mount('#app')



