// 技术情报系统配置文件

const CONFIG = {
    // Google Sheets API配置
    GOOGLE_SHEETS: {
        API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY', // 需要替换为实际的API密钥
        SPREADSHEET_IDS: {
            CONFIG_DB: 'YOUR_CONFIG_DB_SPREADSHEET_ID',
            RAWDATA_DB: 'YOUR_RAWDATA_DB_SPREADSHEET_ID',
            INTELLIGENCE_DB: 'YOUR_INTELLIGENCE_DB_SPREADSHEET_ID',
            OPERATIONS_DB: 'YOUR_OPERATIONS_DB_SPREADSHEET_ID'
        }
    },
    
    // 数据刷新配置
    REFRESH: {
        AUTO_REFRESH_INTERVAL: 30000, // 30秒自动刷新
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 2000
    },
    
    // 图表配置
    CHARTS: {
        COLORS: {
            PRIMARY: '#2563eb',
            SUCCESS: '#10b981',
            WARNING: '#f59e0b',
            DANGER: '#ef4444',
            SECONDARY: '#64748b'
        },
        ANIMATION: {
            DURATION: 1000,
            EASING: 'easeInOutQuart'
        }
    },
    
    // 阈值配置
    THRESHOLDS: {
        SYSTEM_HEALTH: {
            GOOD: 95,
            WARNING: 80
        },
        SIGNAL_STRENGTH: {
            HIGH: 8.0,
            MEDIUM: 6.0
        },
        CONFIDENCE_LEVEL: {
            HIGH: 80,
            MEDIUM: 60
        }
    }
};

// 导出配置（兼容不同模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
