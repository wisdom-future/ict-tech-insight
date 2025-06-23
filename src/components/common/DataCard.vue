<template>
  <div class="card-hover">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="text-2xl">{{ icon }}</div>
        <div>
          <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
          <p class="text-2xl font-bold" :class="getValueColor()">{{ formattedValue }}</p>
        </div>
      </div>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <span class="text-sm" :class="getTrendColor()">
          {{ getTrendIcon() }} {{ Math.abs(trend) }}%
        </span>
        <span class="text-xs text-gray-500">vs 昨日</span>
      </div>
      <div class="w-16 h-8">
        <MiniChart :data="chartData" :color="getChartColor()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumber } from '@/utils/formatters'
import MiniChart from '@/components/charts/MiniChart.vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  trend: Number,
  icon: String,
  color: {
    type: String,
    default: 'primary'
  },
  chartData: Array
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  return formatNumber(props.value)
})

const getValueColor = () => {
  const colors = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600'
  }
  return colors[props.color] || 'text-gray-900'
}

const getTrendColor = () => {
  return props.trend >= 0 ? 'text-success-600' : 'text-danger-600'
}

const getTrendIcon = () => {
  return props.trend >= 0 ? '↗' : '↘'
}

const getChartColor = () => {
  const colors = {
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444'
  }
  return colors[props.color] || '#3b82f6'
}
</script>