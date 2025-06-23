<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">智能分析中心</h2>
      <el-button type="primary" :icon="Refresh" @click="refreshData">刷新分析</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧信息列表 -->
      <div class="lg:col-span-1">
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">信息列表</h3>
          <div class="space-y-2">
            <div
              v-for="item in intelligenceList"
              :key="item.id"
              class="p-3 rounded-md cursor-pointer transition-colors"
              :class="selectedItem?.id === item.id ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50 hover:bg-gray-100'"
              @click="selectItem(item)"
            >
              <h4 class="font-medium text-sm">{{ item.title }}</h4>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-600">{{ item.category }}</span>
                <span class="text-xs font-medium text-primary-600">
                  {{ item.signalStrength }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧分析详情 -->
      <div class="lg:col-span-2">
        <div v-if="selectedItem" class="space-y-6">
          <!-- 基本信息 -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">{{ selectedItem.title }}</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">技术类别:</span>
                <span class="ml-2 font-medium">{{ selectedItem.category }}</span>
              </div>
              <div>
                <span class="text-sm text-gray-600">信号强度:</span>
                <span class="ml-2 font-medium text-primary-600">{{ selectedItem.signalStrength }}</span>
              </div>
              <div>
                <span class="text-sm text-gray-600">置信度:</span>
                <span class="ml-2 font-medium">{{ selectedItem.confidenceLevel }}%</span>
              </div>
              <div>
                <span class="text-sm text-gray-600">发现时间:</span>
                <span class="ml-2 font-medium">{{ formatDate(selectedItem.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 三维分析标签页 -->
          <div class="card">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="商业价值分析" name="commercial">
                <CommercialAnalysis :data="selectedItem.commercialAnalysis" />
              </el-tab-pane>
              <el-tab-pane label="竞争信息分析" name="competitive">
                <CompetitiveAnalysis :data="selectedItem.competitiveAnalysis" />
              </el-tab-pane>
              <el-tab-pane label="技术深度分析" name="technical">
                <TechnicalAnalysis :data="selectedItem.technicalAnalysis" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <div v-else class="card text-center py-12">
          <div class="text-gray-400 text-lg">请选择一个信息项目查看详细分析</div>
        </div>
      </div>
    </div>

    <!-- 对比分析 -->
    <div class="card" v-if="comparisonItems.length > 1">
      <h3 class="text-lg font-semibold mb-4">对比分析</h3>
      <ComparisonChart :data="comparisonData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatters'
import CommercialAnalysis from '@/components/analysis/CommercialAnalysis.vue'
import CompetitiveAnalysis from '@/components/analysis/CompetitiveAnalysis.vue'
import TechnicalAnalysis from '@/components/analysis/TechnicalAnalysis.vue'
import ComparisonChart from '@/components/charts/ComparisonChart.vue'

const activeTab = ref('commercial')
const selectedItem = ref(null)
const comparisonItems = ref([])

const intelligenceList = ref([
  {
    id: 1,
    title: '谷歌量子处理器Willow突破',
    category: '量子计算',
    signalStrength: 9.2,
    confidenceLevel: 95,
    createdAt: '2025-06-23T08:30:00Z',
    commercialAnalysis: {
      tamValue: 50000000000,
      samValue: 15000000000,
      somValue: 2000000000,
      roiPercentage: 245,
      npvValue: 850000000,
      paybackMonths: 18
    },
    competitiveAnalysis: {
      threatLevel: 'high',
      competitorCount: 8,
      marketPosition: 'leader',
      patentStrength: 8.5
    },
    technicalAnalysis: {
      trlLevel: 6,
      feasibilityScore: 8.8,
      innovationDegree: 'disruptive',
      implementationComplexity: 'high'
    }
  }
])

const comparisonData = computed(() => {
  // 对比分析数据处理逻辑
  return {}
})

const selectItem = (item) => {
  selectedItem.value = item
}

const refreshData = () => {
  console.log('刷新分析数据')
}

onMounted(() => {
  if (intelligenceList.value.length > 0) {
    selectedItem.value = intelligenceList.value[0]
  }
})
</script>