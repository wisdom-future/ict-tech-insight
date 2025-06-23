import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export const formatNumber = (num, precision = 0) => {
  if (num === null || num === undefined) return '0'
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(precision) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(precision) + 'K'
  }
  
  return num.toLocaleString('zh-CN', { 
    minimumFractionDigits: precision,
    maximumFractionDigits: precision 
  })
}

export const formatPercentage = (num, precision = 1) => {
  if (num === null || num === undefined) return '0%'
  return (num * 100).toFixed(precision) + '%'
}

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0'
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

export const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
    completed: 'success',
    failed: 'danger',
    running: 'primary'
  }
  return colors[status] || 'info'
}

export const getTrendIcon = (trend) => {
  if (trend > 0) return '📈'
  if (trend < 0) return '📉'
  return '➡️'
}