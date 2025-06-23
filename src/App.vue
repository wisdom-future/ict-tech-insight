<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-blue-600">🚀 ICT Tech Insight</h1>
            <span class="ml-3 text-gray-600">技术信息决策引擎</span>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- 侧边栏导航 -->
      <aside class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="p-4">
          <div class="space-y-2">
            <router-link 
              v-for="route in navigation" 
              :key="route.path"
              :to="route.path"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100"
              :class="$route.path === route.path ? 'bg-blue-100 text-blue-700' : 'text-gray-700'"
            >
              <span class="mr-3">{{ route.icon }}</span>
              {{ route.name }}
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>

    <!-- 底部 -->
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
      © 2025 ICT Tech Insight. Powered by GitHub Pages
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navigation = ref([
  { path: '/', name: '概览仪表板', icon: '🏠' },
  { path: '/collection', name: '数据采集监控', icon: '📥' },
  { path: '/analysis', name: '智能分析中心', icon: '🧠' },
  { path: '/action', name: '行动决策中心', icon: '🎯' },
  { path: '/reports', name: '报告中心', icon: '📑' },
  { path: '/system', name: '系统管理', icon: '⚙️' }
])
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
