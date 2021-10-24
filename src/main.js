import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VEager from '@kuroski/v-eager'
axios.defaults.baseURL = 'https://david-cary.com/api/3/'
// axios.defaults.baseURL = 'http://localhost/api'
// axios.defaults.baseURL = process.env.VUE_APP_API_URL;




createApp(App).use(store).use(router).use(VEager).mount('#app')
