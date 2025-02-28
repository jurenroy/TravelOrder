// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Ensure this is set up correctly
import { pinia } from './store'; // Adjust the path if necessary

createApp(App).use(router).use(pinia).mount('#app');