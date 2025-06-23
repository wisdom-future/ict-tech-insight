import { createRouter, createWebHistory } from 'vue-router'
import Overview from '@/views/Overview.vue'
import Collection from '@/views/Collection.vue'
import Analysis from '@/views/Analysis.vue'
import Action from '@/views/Action.vue'
import Reports from '@/views/Reports.vue'
import Performance from '@/views/System/Performance.vue'
import Configuration from '@/views/System/Configuration.vue'
import Logs from '@/views/System/Logs.vue'
import Users from '@/views/System/Users.vue'

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: Overview,
    meta: { title: '概览仪表板', icon: '🏠' }
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
    meta: { title: '数据采集监控', icon: '📥' }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: Analysis,
    meta: { title: '智能分析中心', icon: '🧠' }
  },
  {
    path: '/action',
    name: 'Action',
    component: Action,
    meta: { title: '行动决策中心', icon: '🎯' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { title: '报告中心', icon: '📑' }
  },
  {
    path: '/system',
    name: 'System',
    meta: { title: '系统管理', icon: '⚙️' },
    children: [
      {
        path: 'performance',
        name: 'Performance',
        component: Performance,
        meta: { title: '性能监控', icon: '📊' }
      },
      {
        path: 'configuration',
        name: 'Configuration',
        component: Configuration,
        meta: { title: '配置管理', icon: '🔧' }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: Logs,
        meta: { title: '日志查看', icon: '📋' }
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { title: '用户管理', icon: '👥' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/ict-tech-insight/'),
  routes
})

export default router