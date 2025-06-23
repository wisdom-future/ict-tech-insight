<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">概览仪表板</h2>
      <el-button type="primary" :icon="Refresh" @click="refreshData">
        刷新数据
      </el-button>
    </div>

    <!-- KPI 指标卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DataCard
        v-for="metric in kpiMetrics"
        :key="metric.key"
        :title="metric.title"
        :value="metric.value"
        :trend="metric.trend"
        :icon="metric.icon"
        :color="metric.color"
      />
    </div>

    <!-- 趋势图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">信息发现趋势</h3>
        <LineChart :data="trendData" height="300px" />
      </div>
      
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">技术热度分布</h3>
        <PieChart :data="techDistribution" height="300px" />
      </div>
    </div>

    <!-- 最新信息流 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">最新高价值信息</h3>
      <div class="space-y-3">
        <div
          v-for="item in latestIntelligence"
          :key="item.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          @click="viewDetails(item)"
        >
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
            <p class="text-sm text-gray-600">{{ item.category }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-primary-600">
              信号强度: {{ item.signalStrength }}
            </span>
            <span class="text-xs text-gray-500">
              {{ formatRelativeTime(item.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { useAppStore } from '@/store'
import { formatRelativeTime } from '@/utils/formatters'
import DataCard from '@/components/common/DataCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

const store = useAppStore()

const kpiMetrics = ref([
  { key: 'today_intelligence', title: '今日新增信息', value: 23, trend: 12.5, icon: '📊', color: 'primary' },
  { key: 'high_value_signals', title: '高价值信号', value: 8, trend: 8.3, icon: '🎯', color: 'success' },
  { key: 'pending_decisions', title: '待决策事项', value: 5, trend: -15.2, icon: '⚠️', color: 'warning' },
  { key: 'system_health', title: '系统健康度', value: 98.5, trend: 2.1, icon: '💚', color: 'success' }
])

const trendData = ref({
  xAxis: ['06-19', '06-20', '06-21', '06-22', '06-23'],
  series: [
    { name: '信息发现', data: [18, 22, 25, 20, 23] },
    { name: '高价值信号', data: [5, 7, 9, 6, 8] }
  ]
})

const techDistribution = ref([
  { name: '人工智能', value: 35 },
  { name: '5G通信', value: 25 },
  { name: '量子计算', value: 15 },
  { name: '区块链', value: 12 },
  { name: '物联网', value: 13 }
])

const latestIntelligence = ref([
  {
    id: 1,
    title: '谷歌发布新一代量子处理器Willow',
    category: '量子计算',
    signalStrength: 9.2,
    createdAt: '2025-06-23T08:30:00Z'
  },
  {
    id: 2,
    title: 'OpenAI推出GPT-5预览版本',
    category: '人工智能',
    signalStrength: 9.8,
    createdAt: '2025-06-23T07:15:00Z'
  }
])

const refreshData = async () => {
  await store.loadOverviewData()
}

const viewDetails = (item) => {
  console.log('查看详情:', item)
}

onMounted(() => {
  refreshData()
})
</script>