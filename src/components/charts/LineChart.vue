<template>
  <div :style="{ height }" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { CHART_COLORS } from '@/utils/constants'

const props = defineProps({
  data: Object,
  height: {
    type: String,
    default: '400px'
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value || !props.data) return

  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: props.data.series?.map(s => s.name) || []
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.xAxis || []
    },
    yAxis: {
      type: 'value'
    },
    series: props.data.series?.map((series, index) => ({
      name: series.name,
      type: 'line',
      data: series.data,
      smooth: true,
      lineStyle: {
        color: CHART_COLORS.GRADIENT[index % CHART_COLORS.GRADIENT.length]
      },
      areaStyle: {
        opacity: 0.1
      }
    })) || []
  }

  chartInstance.setOption(option)
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
})

watch(() => props.data, () => {
  initChart()
}, { deep: true })
</script>