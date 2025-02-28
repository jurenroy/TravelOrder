import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from './store/auth';
// import dashboard from './views/dashboard.vue';
// import leaveform from './views/leaveform.vue'
import ictsrf from './views/ictsrf/dashboard.vue';
import rso from './views/rso/dashboard.vue';

import Layout from './views/layoutV2/Layout.vue';
import Dashboard from './views/dashboard/Dashboard.vue';
import Services from './views/services/Services.vue';
import TravelOrder from './views/travelorderV2/Dashboard.vue';
import LeaveForm from './views/leaveform/Dashboard.vue'

import registration from './views/Registration.vue';
import employeelist from './views/EmployeelistV2.vue';
import editpage from './views/EditPageV2.vue';
import logout from './components/logout/Logout.vue';

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
        path: '/registration',
        name: 'registration',
        component: registration,
        meta: { requiresAuth: true }
      },
      {
        path: '/employeelist',
        name: 'employeelist',
        component: employeelist,
        meta: { requiresAuth: true }
      },
      {
        path: '/settings',
        name: 'editpage',
        component: editpage,
        meta: { requiresAuth: true }
      },
      {
        path: '/logout',
        name: 'logout',
        component: logout,
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
  const authStore = useAuthStore(); // Use the Pinia store
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
  } else if (to.name === 'registration' ){
    document.title = 'MGBXPortal Registration';
  } else if (to.name === 'registration' ){
    document.title = 'MGBXPortal Registration';
  } else if (to.name === 'registration' ){
    document.title = 'MGBXPortal Registration';
  } else if (to.name === 'employeelist' ){
    document.title = 'MGBXPortal Employees';
  } else if (to.name === 'settings' ){
    document.title = 'MGBXPortal Edit Page';
  } else {
    document.title = 'MGB Application Form';
  }  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
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


