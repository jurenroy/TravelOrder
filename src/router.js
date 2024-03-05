import { createRouter, createWebHistory } from 'vue-router'
import home from './views/home.vue'
import dashboard from './views/dashboard.vue'
import form from './views/form.vue'
import login from './views/login.vue'
import pdf from './views/pdf.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: login,
    },
    {
      path: '/home',
      component: home,
    },
    {
      path: '/dashboard',
      component:dashboard,
    },
    {
        path: '/form',
        component:form,
      },
      {
        path: '/pdf',
        component:pdf,
      },
  ],
})
