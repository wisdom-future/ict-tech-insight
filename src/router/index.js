import { createRouter, createWebHistory } from 'vue-router'

// 懒加载组件
const Overview = () => import('@/views/Overview.vue')
const Collection = () => import('@/views/Collection.vue')
const Analysis = () => import('@/views/Analysis.vue')
const Action = () => import('@/views/Action.vue')
const Reports = () => import('@/views/Reports.vue')

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: Overview,
    meta: { title: '概览仪表板' }
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
    meta: { title: '数据采集监控' }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: Analysis,
    meta: { title: '智能分析中心' }
  },
  {
    path: '/action',
    name: 'Action',
    component: Action,
    meta: { title: '行动决策中心' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { title: '报告中心' }
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/performance'
  }
]

const router = createRouter({
  history: createWebHistory('/ict-tech-insight/'),
  routes
})

export default router
