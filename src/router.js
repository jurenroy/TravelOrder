import { createRouter, createWebHistory } from 'vue-router';

// import dashboard from './views/dashboard.vue';
// import leaveform from './views/leaveform.vue'
import ictsrf from './views/ictsrf/dashboard.vue';
import rso from './views/rso/dashboard.vue';

import Layout from './views/layout/Layout.vue';
import Dashboard from './views/dashboard/Dashboard.vue';
import Services from './views/services/Services.vue';
import TravelOrder from './views/travelorder/Dashboard.vue';
import LeaveForm from './views/leaveform/Dashboard.vue';
import FADRF from './views/FADRF/dashboard.vue';


const routes = [
  {
      path: '/',
      component: Layout,
      meta: { requiresAuth: false },
      children: [
      {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: false }
      },
      {
        path: '/services',
        name: 'services',
        component: Services,
        meta: { requiresAuth: true }
      },
      {
        path: '/travelorder',
        name: 'TravelOrder',
        component: TravelOrder,
        meta: { requiresAuth: true }
      },
      {
        path: '/leaveform',
        name: 'LeaveForm',
        component: LeaveForm,
        meta: { requiresAuth: true }
      },
      {
        path: '/ICTSRF',
        name: 'ICTSRF',
        component: ictsrf,
        meta: { requiresAuth: true }
      },
      {
        path: '/rso',
        name: 'rso',
        component: rso,
        meta: { requiresAuth: true }
      },
      {
        path: '/FADRF',
        name: 'FADRF',
        component: FADRF,
        meta: { requiresAuth: true }
      },
      ]
    },
  // {
  //   path: '/leaveform',
  //   name: 'LeaveForm',
  //   component: leaveform,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/travelorder',
  //   name: 'TravelOrder',
  //   component: dashboard,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/ICTSRF',
  //   name: 'ICTSRF',
  //   component: ictsrf,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/rso',
  //   name: 'rso',
  //   component: rso,
  //   meta: { requiresAuth: true }
  // },
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
  } else if (to.name === 'ICTSRF' ) {
    document.title = 'MGB ICT Request Form';
  } else if (to.name === 'rso' ) {
    document.title = 'MGB Special Order';
  } else if (to.name === 'services' ){
    document.title = 'MGBXPress Desk';
  } else if (to.name === 'FADRF' ){
    document.title = 'FADREQUESTFORM';
  }else {
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


