import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchData } from '@/utils/api'

export const useAppStore = defineStore('app', () => {
  // 状态
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)
  
  // Overview 数据
  const overviewData = ref({})
  const collectionData = ref({})
  const analysisData = ref({})
  const actionData = ref({})
  const systemData = ref({})
  const reportsData = ref({})

  // 计算属性
  const isDataStale = computed(() => {
    if (!lastUpdated.value) return true
    const now = new Date()
    const updated = new Date(lastUpdated.value)
    return (now - updated) > 3600000 // 1小时
  })

  // 方法
  const loadOverviewData = async () => {
    try {
      loading.value = true
      const [kpi, trends, intelligence] = await Promise.all([
        fetchData('/data/overview/kpi-metrics.json'),
        fetchData('/data/overview/trend-charts.json'),
        fetchData('/data/overview/latest-intelligence.json')
      ])
      
      overviewData.value = { kpi, trends, intelligence }
      lastUpdated.value = new Date().toISOString()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const loadCollectionData = async () => {
    try {
      loading.value = true
      const [techData, benchmarkData, qualityMetrics] = await Promise.all([
        fetchData('/data/collection/tech-data-status.json'),
        fetchData('/data/collection/benchmark-status.json'),
        fetchData('/data/collection/quality-metrics.json')
      ])
      
      collectionData.value = { techData, benchmarkData, qualityMetrics }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    loading,
    error,
    lastUpdated,
    overviewData,
    collectionData,
    analysisData,
    actionData,
    systemData,
    reportsData,
    
    // 计算属性
    isDataStale,
    
    // 方法
    loadOverviewData,
    loadCollectionData,
    clearError
  }
})