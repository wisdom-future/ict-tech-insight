import axios from 'axios'

const api = axios.create({
  baseURL: '/ict-tech-insight',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  error => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.config.url}`, response.data)
    return response
  },
  error => {
    console.error('❌ API Response Error:', error)
    if (error.response?.status === 404) {
      console.warn('📄 Data file not found, using mock data')
      return { data: {} }
    }
    return Promise.reject(error)
  }
)

export const fetchData = async (url) => {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error)
    throw error
  }
}

export default api