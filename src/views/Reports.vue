<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">报告中心</h2>
      <div class="flex space-x-3">
        <el-button :icon="Download" @click="exportReport">导出报告</el-button>
        <el-button type="primary" :icon="Plus" @click="createCustomReport">自定义报告</el-button>
      </div>
    </div>

    <!-- 报告类型导航 -->
    <div class="card">
      <el-tabs v-model="activeReportType" @tab-click="handleTabClick">
        <el-tab-pane label="📰 日报" name="daily">
          <DailyReports />
        </el-tab-pane>
        <el-tab-pane label="📅 周报" name="weekly">
          <WeeklyReports />
        </el-tab-pane>
        <el-tab-pane label="📈 月报" name="monthly">
          <MonthlyReports />
        </el-tab-pane>
        <el-tab-pane label="📊 自定义" name="custom">
          <CustomReports />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 最新报告快速访问 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        v-for="report in latestReports"
        :key="report.id"
        class="card-hover cursor-pointer"
        @click="viewReport(report)"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">{{ report.title }}</h3>
          <span class="text-2xl">{{ report.icon }}</span>
        </div>
        <p class="text-sm text-gray-600 mb-3">{{ report.description }}</p>
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ formatDate(report.generatedAt) }}</span>
          <el-tag size="small" :type="report.priority === 'high' ? 'danger' : 'primary'">
            {{ report.priority === 'high' ? '重要' : '常规' }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 报告订阅设置 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">报告订阅设置</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="subscription in subscriptionSettings"
          :key="subscription.type"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium">{{ subscription.title }}</h4>
            <el-switch v-model="subscription.enabled" @change="updateSubscription(subscription)" />
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <div>频率: {{ subscription.frequency }}</div>
            <div>发送时间: {{ subscription.schedule }}</div>
            <div>接收方式: {{ subscription.channels.join(', ') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download, Plus } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatters'
import DailyReports from '@/components/reports/DailyReports.vue'
import WeeklyReports from '@/components/reports/WeeklyReports.vue'
import MonthlyReports from '@/components/reports/MonthlyReports.vue'
import CustomReports from '@/components/reports/CustomReports.vue'

const activeReportType = ref('daily')

const latestReports = ref([
  {
    id: 1,
    title: '技术信息日报',
    icon: '📊',
    description: '今日发现8个高价值技术信号，包含量子计算和AI芯片重大突破',
    generatedAt: '2025-06-23T09:00:00Z',
    priority: 'high'
  },
  {
    id: 2,
    title: '竞争情报周报',
    icon: '🏢',
    description: '本周竞争对手动态分析，3家公司发布重要产品',
    generatedAt: '2025-06-22T18:00:00Z',
    priority: 'normal'
  },
  {
    id: 3,
    title: '技术趋势月报',
    icon: '📈',
    description: '6月技术发展趋势总结，AI和量子计算持续领先',
    generatedAt: '2025-06-01T00:00:00Z',
    priority: 'normal'
  }
])

const subscriptionSettings = ref([
  {
    type: 'daily_executive',
    title: '高管日报',
    enabled: true,
    frequency: '每日',
    schedule: '08:00',
    channels: ['邮件', 'Slack']
  },
  {
    type: 'weekly_technical',
    title: '技术周报',
    enabled: true,
    frequency: '每周一',
    schedule: '09:00',
    channels: ['邮件']
  },
  {
    type: 'monthly_strategic',
    title: '战略月报',
    enabled: false,
    frequency: '每月1日',
    schedule: '10:00',
    channels: ['邮件']
  }
])

const handleTabClick = (tab) => {
  console.log('切换到:', tab.name)
}

const exportReport = () => {
  console.log('导出报告')
}

const createCustomReport = () => {
  console.log('创建自定义报告')
}

const viewReport = (report) => {
  console.log('查看报告:', report)
}

const updateSubscription = (subscription) => {
  console.log('更新订阅:', subscription)
}

onMounted(() => {
  // 初始化数据
})
</script>