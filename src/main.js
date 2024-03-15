import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './store'

/* eslint-disable vue/injection-key */
createApp(App).use(router).use(pinia).mount('#app')
/* eslint-enable vue/injection-key */