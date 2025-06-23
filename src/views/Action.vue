<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">行动决策中心</h2>
      <div class="flex space-x-3">
        <el-button :icon="Filter" @click="openFilter">筛选</el-button>
        <el-button type="primary" :icon="Plus" @click="createRecommendation">新建建议</el-button>
      </div>
    </div>

    <!-- 优先级看板 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PriorityCard
        v-for="priority in priorityStats"
        :key="priority.level"
        :data="priority"
        @view-items="viewPriorityItems"
      />
    </div>

    <!-- 决策建议列表 -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">行动建议</h3>
        <div class="flex space-x-2">
          <el-select v-model="filterStatus" placeholder="状态筛选" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="待审批" value="pending" />
            <el-option label="已批准" value="approved" />
            <el-option label="实施中" value="implementing" />
            <el-option label="已完成" value="completed" />
          </el-select>
          <el-select v-model="filterPriority" placeholder="优先级" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="紧急" value="urgent" />
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </div>
      </div>

      <el-table :data="filteredRecommendations" stripe>
        <el-table-column prop="title" label="建议标题" min-width="200">
          <template #default="{ row }">
            <div class="cursor-pointer" @click="viewDetails(row)">
              <div class="font-medium text-gray-900">{{ row.title }}</div>
              <div class="text-sm text-gray-600">{{ row.category }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="priorityLevel" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priorityLevel)">
              {{ getPriorityText(row.priorityLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="investmentLevel" label="投资级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getInvestmentType(row.investmentLevel)">
              {{ row.investmentLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expectedImpact" label="预期影响" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.expectedImpact" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="roiEstimation" label="ROI估算" width="100">
          <template #default="{ row }">
            <span class="font-medium text-green-600">{{ row.roiEstimation }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="decisionDeadline" label="决策截止" width="120">
          <template #default="{ row }">
            {{ formatDate(row.decisionDeadline, 'MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetails(row)">详情</el-button>
            <el-button size="small" type="primary" @click="approve(row)" v-if="row.status === 'pending'">
              批准
            </el-button>
            <el-button size="small" type="success" @click="implement(row)" v-if="row.status === 'approved'">
              实施
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 执行跟踪 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">实施进度跟踪</h3>
      <div class="space-y-4">
        <div
          v-for="item in implementationTracking"
          :key="item.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium">{{ item.title }}</h4>
            <span class="text-sm text-gray-600">{{ item.progress }}% 完成</span>
          </div>
          <el-progress :percentage="item.progress" :status="getProgressStatus(item.progress)" />
          <div class="mt-2 text-sm text-gray-600">
            下一个里程碑: {{ item.nextMilestone }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Filter, Plus } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatters'
import PriorityCard from '@/components/common/PriorityCard.vue'

const filterStatus = ref('')
const filterPriority = ref('')

const priorityStats = ref([
  { level: 'urgent', label: '紧急', count: 3, color: 'danger' },
  { level: 'high', label: '高优先级', count: 8, color: 'warning' },
  { level: 'medium', label: '中优先级', count: 15, color: 'primary' },
  { level: 'low', label: '低优先级', count: 5, color: 'info' }
])

const recommendations = ref([
  {
    id: 1,
    title: '投资量子计算研发团队',
    category: '技术投资',
    priorityLevel: 'urgent',
    investmentLevel: 'high',
    expectedImpact: 4,
    roiEstimation: 245,
    status: 'pending',
    decisionDeadline: '2025-06-30T00:00:00Z'
  }
])

const implementationTracking = ref([
  {
    id: 1,
    title: 'AI芯片技术合作项目',
    progress: 65,
    nextMilestone: '原型测试完成'
  }
])

const filteredRecommendations = computed(() => {
  return recommendations.value.filter(item => {
    const statusMatch = !filterStatus.value || item.status === filterStatus.value
    const priorityMatch = !filterPriority.value || item.priorityLevel === filterPriority.value
    return statusMatch && priorityMatch
  })
})

const openFilter = () => {
  console.log('打开筛选')
}

const createRecommendation = () => {
  console.log('创建新建议')
}

const viewPriorityItems = (priority) => {
  filterPriority.value = priority.level
}

const viewDetails = (item) => {
  console.log('查看详情:', item)
}

const approve = (item) => {
  item.status = 'approved'
  console.log('批准:', item)
}

const implement = (item) => {
  item.status = 'implementing'
  console.log('实施:', item)
}

const getPriorityType = (priority) => {
  const types = { urgent: 'danger', high: 'warning', medium: 'primary', low: 'info' }
  return types[priority] || 'info'
}

const getPriorityText = (priority) => {
  const texts = { urgent: '紧急', high: '高', medium: '中', low: '低' }
  return texts[priority] || priority
}

const getInvestmentType = (level) => {
  const types = { high: 'danger', medium: 'warning', low: 'success' }
  return types[level] || 'info'
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'primary',
    implementing: 'success',
    completed: 'success'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审批',
    approved: '已批准',
    implementing: '实施中',
    completed: '已完成'
  }
  return texts[status] || status
}

const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success'
  if (progress >= 80) return 'warning'
  return undefined
}

onMounted(() => {
  // 初始化数据
})
</script>