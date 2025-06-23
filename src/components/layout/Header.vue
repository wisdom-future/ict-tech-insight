<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gradient">
            ICT Tech Insight
          </h1>
          <span class="text-sm text-gray-500">
            技术信息决策引擎
          </span>
        </div>
        
        <div class="flex items-center space-x-4">
          <el-badge :value="notifications" class="mr-4">
            <el-button :icon="Bell" circle />
          </el-badge>
          
          <div class="flex items-center space-x-2">
            <el-avatar :size="32" src="/avatar.jpg" />
            <span class="text-sm font-medium">Jason</span>
          </div>
          
          <div class="text-xs text-gray-500">
            最后更新: {{ formatRelativeTime(lastUpdated) }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { useAppStore } from '@/store'
import { formatRelativeTime } from '@/utils/formatters'

const store = useAppStore()

const notifications = computed(() => 3) // 示例通知数量
const lastUpdated = computed(() => store.lastUpdated)
</script>