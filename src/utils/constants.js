export const API_ENDPOINTS = {
  OVERVIEW: '/data/overview',
  COLLECTION: '/data/collection',
  ANALYSIS: '/data/analysis',
  ACTION: '/data/action',
  SYSTEM: '/data/system',
  REPORTS: '/data/reports'
}

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#6b7280',
  GRADIENT: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
}

export const DATA_REFRESH_INTERVAL = 5 * 60 * 1000 // 5分钟

export const TECH_CATEGORIES = [
  { key: 'ai', label: '人工智能', icon: '🤖' },
  { key: '5g', label: '5G通信', icon: '📡' },
  { key: 'quantum', label: '量子计算', icon: '⚛️' },
  { key: 'blockchain', label: '区块链', icon: '🔗' },
  { key: 'iot', label: '物联网', icon: '🌐' },
  { key: 'cloud', label: '云计算', icon: '☁️' }
]

export const PRIORITY_LEVELS = {
  URGENT: { label: '紧急', color: 'danger', value: 4 },
  HIGH: { label: '高', color: 'warning', value: 3 },
  MEDIUM: { label: '中', color: 'primary', value: 2 },
  LOW: { label: '低', color: 'info', value: 1 }
}