import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = 'https://david-cary.com/api/3/'
// axios.defaults.baseURL = 'http://localhost/api'

createApp(App).use(store).use(router).mount('#app')
