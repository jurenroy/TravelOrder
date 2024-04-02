import { createRouter, createWebHistory } from 'vue-router'
import highway from './views/highway.vue'
import Otp from './components/otp.vue'
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: highway,
    },
    {
      path: '/otp',
      component: Otp,
    },
  ],
  
})
