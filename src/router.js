import { createRouter, createWebHistory } from 'vue-router';

import highway from './views/highway.vue';
import frontpage from './views/frontpage.vue';
import dashboard from './views/dashboard.vue';
import leaveform from './views/leaveform.vue'
import leavepdf from './views/leavepdf.vue';
import Leavepdfview from './views/leavepdfview.vue';


const routes = [
  {
    path: '/',
    component: highway,
    meta: { requiresAuth: false }
  },
  {
    path: '/leaveform',
    name: 'LeaveForm',
    component: leaveform,
    meta: { requiresAuth: true }
  },
  {
    path: '/travelorder',
    name: 'TravelOrder',
    component: dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/pdf',
    name: 'PDF',
    component: leavepdf,
    meta: { requiresAuth: false }
  },
  {
    path: '/pdfz',
    name: 'PDF',
    component: Leavepdfview,
    meta: { requiresAuth: false }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === 'TravelOrder' ) {
    document.title = 'MGB Travel Order Form';
  } else if (to.name === 'LeaveForm' ) {
    document.title = 'MGB Leave Form';
  } else {
    document.title = 'MGB Application Form';
  }  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('isLoggedIn') === 'false') {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
      
    } else {
      next()
    }
  } else {
    
    next()
  }
})

export default router;


