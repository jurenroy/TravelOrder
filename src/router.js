import { createRouter, createWebHistory } from 'vue-router'
import highway from './views/highway.vue'
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: highway,
    },
  ],
  
})
