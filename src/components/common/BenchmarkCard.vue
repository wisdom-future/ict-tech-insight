<template>
  <div class="card-hover">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <span class="text-2xl">{{ data.icon }}</span>
        <div>
          <h3 class="font-semibold text-gray-900">{{ data.title }}</h3>
          <div class="flex items-center space-x-2 mt-1">
            <el-tag :type="getStatusType(data.status)" size="small">
              {{ getStatusText(data.status) }}
            </el-tag>
            <span class="text-xs text-gray-500">
              {{ formatRelativeTime(data.lastUpdate) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">今日发现</span>
        <span class="font-semibold text-primary-600">{{ data.todayCount }}</span>
      </div>
      
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">总计</span>
        <span class="font-medium">{{ formatNumber(data.totalCount) }}</span>
      </div>
      
      <div class="flex justify-between items-center" v-if="data.criticalEvents">
        <span class="text-sm text-gray-600">关键事件</span>
        <span class="font-medium text-warning-600">{{ data.criticalEvents }}</span>
      </div>
      
      <div class="flex justify-between items-center" v-if="data.breakthroughCount">
        <span class="text-sm text-gray-600">突破性发现</span>
        <span class="font-medium text-success-600">{{ data.breakthroughCount }}</span>
      </div>
      
      <div class="flex justify-between items-center" v-if="data.majorLaunches">
        <span class="text-sm text-gray-600">重要发布</span>
        <span class="font-medium text-primary-600">{{ data.majorLaunches }}</span>
      </div>
      
      <div class="flex justify-between items-center" v-if="data.executiveChanges">
        <span class="text-sm text-gray-600">高管变动</span>
        <span class="font-medium text-danger-600">{{ data.executiveChanges }}</span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">7天趋势</span>
        <el-button size="small" text @click="$emit('view-details', data)">
          查看详情
        </el-button>
      </div>
      <MiniChart :data="data.trendData" color="#8b5cf6" height="40" />
    </div>
  </div>
</template>

<script setup>
import { formatNumber, formatRelativeTime } from '@/utils/formatters'
import MiniChart from '@/components/charts/MiniChart.vue'

defineProps({
  data: Object
})

defineEmits(['view-details'])

const getStatusType = (status) => {
  const types = { active: 'success', inactive: 'danger', pending: 'warning' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { active: '正常', inactive: '异常', pending: '等待' }
  return texts[status] || status
}
</script>