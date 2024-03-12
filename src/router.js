import { createRouter, createWebHistory } from 'vue-router'
import logout from './components/logout.vue'
import home from './views/home.vue'
import dashboard from './views/dashboard.vue'
import form from './views/form.vue'
import login from './views/login.vue'
import pdf from './views/pdf.vue'
import registration from './views/regis.vue'
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: login,
    },
    {
      path: '/logout',
      component: logout,
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
      {
        path: '/registration',
        component:registration,
      },
  ],
  
})
