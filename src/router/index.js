import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '../views/EmployeeList.vue'
import login from '../components/login.vue'
import registration from '../components/registration.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'registration',
component: registration
    },
    {
      path: '/EmployeeList',
      name: 'EmployeeList',
component: EmployeeList
    }
  ]
})

export default router
