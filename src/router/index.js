import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: () => import('../views/Overview.vue')
  },
  {
    path: '/collection',
    name: 'Collection', 
    component: () => import('../views/Collection.vue')
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/Analysis.vue')
  },
  {
    path: '/action',
    name: 'Action',
    component: () => import('../views/Action.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/ict-tech-insight/'),
  routes
})

export default router
