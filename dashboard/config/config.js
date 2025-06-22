// 技术洞察系统增强配置文件

const CONFIG = {
    // Google Sheets API配置
    GOOGLE_SHEETS: {
        API_KEY: 'AIzaSyCgwfInAQt9nBL_uM-k_caOtu21q3KLXbY', // 需要替换为实际的API密钥
        
        // 数据库配置 - 每个数据库包含多个工作表
        DATABASES: {
            // 📋 配置管理数据库
            CONFIG_DB: {
                SPREADSHEET_ID: '14jCzQclmFaHRH8iHrYt9v2Tk-bZ8TVrvbhXUZyFITNE',
                SHEETS: {
                    TECHNOLOGY_REGISTRY: 'Technology_Registry',
                    COMPETITOR_REGISTRY: 'Competitor_Registry', 
                    CONFERENCE_REGISTRY: 'Conference_Registry'
                }
            },
            
            // 📥 原始数据数据库
            RAWDATA_DB: {
                SPREADSHEET_ID: '17CSJX53IF628jsaZbtab2rCaVhi71DRCSKUOQnRKyoU',
                SHEETS: {
                    RAW_ACADEMIC_PAPERS: 'Raw_Academic_Papers',
                    RAW_PATENT_DATA: 'Raw_Patent_Data',
                    RAW_OPENSOURCE_DATA: 'Raw_OpenSource_Data',
                    RAW_TECH_NEWS: 'Raw_Tech_News',
                    RAW_INDUSTRY_DYNAMICS: 'Raw_Industry_Dynamics',
                    RAW_COMPETITOR_INTELLIGENCE: 'Raw_Competitor_Intelligence'
                }
            },
            
            // 🧠 核心洞察数据库
            INTELLIGENCE_DB: {
                SPREADSHEET_ID: '1B9WQzSL56TY04E-633Io3A1X5AWmPr8XypGiU92OXu0',
                SHEETS: {
                    TECH_INTELLIGENCE_MASTER: 'Tech_Intelligence_Master',
                    EVIDENCE_VALIDATION_MATRIX: 'Evidence_Validation_Matrix',
                    COMMERCIAL_VALUE_QUANTIFICATION: 'Commercial_Value_Quantification',
                    COMPETITIVE_INTELLIGENCE_MONITOR: 'Competitive_Intelligence_Monitor',
                    TECHNICAL_DEEP_ANALYSIS: 'Technical_Deep_Analysis',
                    ACTION_RECOMMENDATIONS: 'Action_Recommendations'
                }
            },
            
            // 🔧 系统运营数据库
            OPERATIONS_DB: {
                SPREADSHEET_ID: '1ht0-r9yyIYd7I_ULubkKbKTVgxablvfyJgz09DfbKXk',
                SHEETS: {
                    WORKFLOW_EXECUTION_LOG: 'Workflow_Execution_Log',
                    DATA_QUALITY_REPORTS: 'Data_Quality_Reports'
                }
            }
        }
    },
    
    // 数据刷新配置
    REFRESH: {
        AUTO_REFRESH_INTERVAL: 30000, // 30秒自动刷新
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 2000,
        TIMEOUT: 10000, // 10秒超时
        BATCH_SIZE: 100 // 批量处理大小
    },
    
    // 图表配置
    CHARTS: {
        COLORS: {
            PRIMARY: '#2563eb',
            PRIMARY_LIGHT: '#3b82f6',
            SUCCESS: '#10b981',
            SUCCESS_LIGHT: '#34d399',
            WARNING: '#f59e0b',
            WARNING_LIGHT: '#fbbf24',
            DANGER: '#ef4444',
            DANGER_LIGHT: '#f87171',
            SECONDARY: '#64748b',
            INFO: '#06b6d4'
        },
        ANIMATION: {
            DURATION: 1000,
            EASING: 'easeInOutQuart',
            ENABLED: true
        },
        RESPONSIVE: true,
        MAINTAIN_ASPECT_RATIO: false
    },
    
    // 阈值配置
    THRESHOLDS: {
        SYSTEM_HEALTH: {
            EXCELLENT: 95,
            GOOD: 85,
            WARNING: 70,
            CRITICAL: 50
        },
        SIGNAL_STRENGTH: {
            VERY_HIGH: 9.0,
            HIGH: 8.0,
            MEDIUM: 6.0,
            LOW: 4.0
        },
        CONFIDENCE_LEVEL: {
            VERY_HIGH: 90,
            HIGH: 80,
            MEDIUM: 60,
            LOW: 40
        },
        DATA_QUALITY: {
            EXCELLENT: 9.0,
            GOOD: 7.0,
            ACCEPTABLE: 5.0,
            POOR: 3.0
        }
    },
    
    // UI配置
    UI: {
        THEME: 'light', // light, dark, auto
        LANGUAGE: 'zh-CN',
        TIMEZONE: 'Asia/Shanghai',
        DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
        NUMBER_FORMAT: {
            LOCALE: 'zh-CN',
            CURRENCY: 'CNY'
        }
    },
    
    // 功能开关
    FEATURES: {
        AUTO_REFRESH: true,
        REAL_TIME_ALERTS: true,
        EXPORT_DATA: true,
        DARK_MODE: true,
        PWA_SUPPORT: true,
        OFFLINE_MODE: false
    },
    
    // 性能配置
    PERFORMANCE: {
        LAZY_LOADING: true,
        VIRTUAL_SCROLLING: false,
        CHART_DECIMATION: true,
        CACHE_ENABLED: true,
        CACHE_DURATION: 300000 // 5分钟缓存
    },
    
    // 错误处理配置
    ERROR_HANDLING: {
        SHOW_STACK_TRACE: false,
        AUTO_RETRY: true,
        LOG_ERRORS: true,
        SENTRY_DSN: null // 可选的错误监控服务
    },
    
    // 数据列映射配置
    COLUMN_MAPPINGS: {
        TECH_INTELLIGENCE_MASTER: {
            INTELLIGENCE_ID: 0,        // A列
            TECH_ID: 1,               // B列
            TECH_KEYWORD: 2,          // C列
            TITLE: 3,                 // D列
            CONTENT_SUMMARY: 4,       // E列
            DATA_TYPE: 5,             // F列
            SOURCE_URL: 6,            // G列
            TRIGGER_SOURCE: 7,        // H列
            SIGNAL_STRENGTH: 8,       // I列
            BREAKTHROUGH_SCORE: 9,    // J列
            COMMERCIAL_VALUE_SCORE: 10, // K列
            CONFIDENCE_LEVEL: 11,     // L列
            PRIORITY_LEVEL: 12,       // M列
            PROCESSING_STATUS: 13,    // N列
            CREATED_TIMESTAMP: 20     // U列
        },
        WORKFLOW_EXECUTION_LOG: {
            EXECUTION_ID: 0,          // A列
            WORKFLOW_NAME: 1,         // B列
            WORKFLOW_VERSION: 2,      // C列
            EXECUTION_STATUS: 3,      // D列
                                START_TIMESTAMP: 4,       // E列
            END_TIMESTAMP: 5,         // F列
            DURATION_SECONDS: 6,      // G列
            PROCESSED_RECORDS: 7,     // H列
            SUCCESS_COUNT: 8,         // I列
            ERROR_COUNT: 9,           // J列
            WARNING_COUNT: 10,        // K列
            TRIGGER_SOURCE: 12        // M列
        },
        DATA_QUALITY_REPORTS: {
            REPORT_ID: 0,             // A列
            REPORT_DATE: 1,           // B列
            DATA_SOURCE: 3,           // D列
            TABLE_NAME: 4,            // E列
            TOTAL_RECORDS: 5,         // F列
            VALID_RECORDS: 6,         // G列
            DATA_ACCURACY_PERCENTAGE: 10,  // K列
            DATA_COMPLETENESS_PERCENTAGE: 11, // L列
            DATA_CONSISTENCY_PERCENTAGE: 12,  // M列
            OVERALL_QUALITY_SCORE: 14 // O列
        }
    },
    
    // API端点配置
    API: {
        BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
        BATCH_ENDPOINT: '/values:batchGet',
        SINGLE_ENDPOINT: '/values',
        REQUEST_HEADERS: {
            'Content-Type': 'application/json'
        }
    }
};

// 配置验证函数
CONFIG.validate = function() {
    const required = [
        'GOOGLE_SHEETS.API_KEY',
        'GOOGLE_SHEETS.DATABASES.CONFIG_DB.SPREADSHEET_ID',
        'GOOGLE_SHEETS.DATABASES.RAWDATA_DB.SPREADSHEET_ID',
        'GOOGLE_SHEETS.DATABASES.INTELLIGENCE_DB.SPREADSHEET_ID',
        'GOOGLE_SHEETS.DATABASES.OPERATIONS_DB.SPREADSHEET_ID'
    ];
    
    const errors = [];
    
    for (const path of required) {
        const value = this.getNestedValue(path);
        if (!value || value.startsWith('YOUR_')) {
            errors.push(`配置项 ${path} 未设置或使用默认值`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// 获取嵌套配置值
CONFIG.getNestedValue = function(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], this);
};

// 获取工作表完整范围
CONFIG.getSheetRange = function(database, sheet, range = '') {
    const db = this.GOOGLE_SHEETS.DATABASES[database];
    if (!db) return null;
    
    const sheetName = db.SHEETS[sheet];
    if (!sheetName) return null;
    
    return range ? `${sheetName}!${range}` : sheetName;
};

// 获取API URL
CONFIG.getApiUrl = function(spreadsheetId, range) {
    return `${this.API.BASE_URL}/${spreadsheetId}/values/${range}?key=${this.GOOGLE_SHEETS.API_KEY}`;
};

// 导出配置（兼容不同模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
