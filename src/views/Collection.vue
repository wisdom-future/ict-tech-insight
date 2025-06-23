<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">数据采集监控</h2>
      <div class="flex space-x-3">
        <el-button :icon="Setting" @click="openSettings">配置</el-button>
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 技术数据监控区域 -->
    <div class="card">
      <h3 class="text-xl font-semibold mb-6 flex items-center">
        <span class="mr-2">💻</span>
        技术数据监控
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TechDataCard
          v-for="source in techDataSources"
          :key="source.key"
          :data="source"
          @view-details="viewTechDetails"
        />
      </div>
    </div>

    <!-- 业界标杆监控区域 -->
    <div class="card">
      <h3 class="text-xl font-semibold mb-6 flex items-center">
        <span class="mr-2">🏆</span>
        业界标杆监控
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BenchmarkCard
          v-for="benchmark in benchmarkSources"
          :key="benchmark.key"
          :data="benchmark"
          @view-details="viewBenchmarkDetails"
        />
      </div>
    </div>

    <!-- 数据质量监控 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">数据质量趋势</h3>
        <LineChart :data="qualityTrendData" height="250px" />
      </div>
      
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">采集成功率</h3>
        <BarChart :data="successRateData" height="250px" />
      </div>
    </div>

    <!-- 执行日志表格 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">最近执行日志</h3>
      <el-table :data="executionLogs" stripe>
        <el-table-column prop="workflowName" label="工作流" width="200" />
        <el-table-column prop="executionTime" label="执行时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.executionTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="processedRecords" label="处理记录数" width="120" />
        <el-table-column prop="successCount" label="成功数" width="100" />
        <el-table-column prop="errorCount" label="错误数" width="100" />
        <el-table-column prop="duration" label="耗时(秒)" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewLog(row)">查看</el-button>
            <el-button size="small" type="warning" @click="retryExecution(row)" v-if="row.status === 'failed'">
              重试
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Refresh, Setting } from '@element-plus/icons-vue'
import { useAppStore } from '@/store'
import { formatDate } from '@/utils/formatters'
import TechDataCard from '@/components/common/TechDataCard.vue'
import BenchmarkCard from '@/components/common/BenchmarkCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const store = useAppStore()

const techDataSources = ref([
  {
    key: 'academic_papers',
    title: '学术论文',
    icon: '📚',
    todayCount: 45,
    totalCount: 1250,
    successRate: 98.5,
    avgScore: 8.2,
    status: 'active',
    trendData: [30, 35, 42, 38, 45],
    lastUpdate: '2025-06-23T09:30:00Z'
  },
  {
    key: 'patent_data',
    title: '专利数据',
    icon: '🔬',
    todayCount: 78,
    totalCount: 3420,
    successRate: 96.8,
    avgScore: 7.9,
    status: 'active',
    trendData: [65, 70, 75, 72, 78],
    lastUpdate: '2025-06-23T09:30:00Z'
  },
  {
    key: 'opensource_projects',
    title: '开源项目',
    icon: '💻',
    todayCount: 23,
    totalCount: 890,
    successRate: 94.2,
    avgScore: 8.5,
    status: 'active',
    trendData: [18, 20, 25, 21, 23],
    lastUpdate: '2025-06-23T09:30:00Z'
  },
  {
    key: 'tech_news',
    title: '技术新闻',
    icon: '📰',
    todayCount: 156,
    totalCount: 5670,
    successRate: 99.1,
    avgScore: 7.5,
    status: 'active',
    trendData: [120, 135, 148, 142, 156],
    lastUpdate: '2025-06-23T09:30:00Z'
  }
])

const benchmarkSources = ref([
  {
    key: 'industry_dynamics',
    title: '标杆动态',
    icon: '🏭',
    todayCount: 32,
    totalCount: 1180,
    criticalEvents: 5,
    avgImpactScore: 8.1,
    status: 'active',
    trendData: [25, 28, 35, 30, 32],
    lastUpdate: '2025-06-23T09:30:00Z'
  },
  {
    key: 'tech_innovation',
    title: '技术创新',
    icon: '🚀',
    todayCount: 18,
    totalCount: 650,
    breakthroughCount: 3,
    avgScore: 8.7,
    status: 'active',
    trendData: [12, 15, 20, 16, 18],
    lastUpdate: '2025-06-23T09:30:00Z'
  },
  {
    key: 'product_launches',
    title: '产品发布',
    icon: '📱',
    todayCount: 8,
    totalCount: 340,
    majorLaunches: 2,
    avgImpact: 7.8,
    status: 'active',
    trendData: [5, 6, 9, 7, 8],
    lastUpdate: '2025-06-23T09:30:00Z'
  },
  {
    key: 'talent_movement',
    title: '人才流动',
    icon: '👥',
    todayCount: 12,
    totalCount: 450,
    executiveChanges: 3,
    avgInfluence: 8.3,
    status: 'active',
    trendData: [8, 10, 14, 11, 12],
    lastUpdate: '2025-06-23T09:30:00Z'
  }
])

const qualityTrendData = ref({
  xAxis: ['06-19', '06-20', '06-21', '06-22', '06-23'],
  series: [
    { name: '完整性', data: [95, 96, 94, 97, 95] },
    { name: '准确性', data: [92, 93, 91, 94, 92] },
    { name: '及时性', data: [98, 97, 99, 98, 99] }
  ]
})

const successRateData = ref({
  xAxis: ['学术论文', '专利数据', '开源项目', '技术新闻', '标杆动态', '技术创新'],
  series: [{ name: '成功率(%)', data: [98.5, 96.8, 94.2, 99.1, 97.3, 95.8] }]
})

const executionLogs = ref([
  {
    id: 1,
    workflowName: 'WF1-学术论文监控流',
    executionTime: '2025-06-23T00:30:00Z',
    processedRecords: 45,
    successCount: 44,
    errorCount: 1,
    duration: 1250,
    status: 'completed'
  },
  {
    id: 2,
    workflowName: 'WF2-专利申请追踪流',
    executionTime: '2025-06-23T00:30:00Z',
    processedRecords: 78,
    successCount: 76,
    errorCount: 2,
    duration: 1680,
    status: 'completed'
  }
])

const refreshData = async () => {
  await store.loadCollectionData()
}

const openSettings = () => {
  console.log('打开设置')
}

const viewTechDetails = (data) => {
  console.log('查看技术数据详情:', data)
}

const viewBenchmarkDetails = (data) => {
  console.log('查看标杆数据详情:', data)
}

const viewLog = (log) => {
  console.log('查看日志:', log)
}

const retryExecution = (log) => {
  console.log('重试执行:', log)
}

const getStatusType = (status) => {
  const types = {
    completed: 'success',
    running: 'primary',
    failed: 'danger',
    pending: 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    completed: '已完成',
    running: '运行中',
    failed: '失败',
    pending: '等待中'
  }
  return texts[status] || status
}

onMounted(() => {
  refreshData()
})
</script>