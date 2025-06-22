// 增强版工具函数库

const Utils = {
    // 日期时间格式化
    formatDateTime(dateString, format = 'default') {
        if (!dateString || dateString === '--') return '--';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '--';

        const formats = {
            default: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            },
            short: {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            },
            date: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            },
            time: {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            },
            relative: null // 特殊处理
        };

        if (format === 'relative') {
            return this.getRelativeTime(date);
        }

        const options = formats[format] || formats.default;
        return date.toLocaleString(CONFIG.UI.LANGUAGE, options);
    },

    // 相对时间
    getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;

        return this.formatDateTime(date, 'date');
    },

    // 数字格式化
    formatNumber(num, options = {}) {
        if (typeof num !== 'number' || isNaN(num)) return '--';

        const defaultOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        };

        const formatOptions = { ...defaultOptions, ...options };
        return num.toLocaleString(CONFIG.UI.NUMBER_FORMAT.LOCALE, formatOptions);
    },

    // 百分比格式化
    formatPercentage(num, decimals = 1) {
        if (typeof num !== 'number' || isNaN(num)) return '--';
        return `${num.toFixed(decimals)}%`;
    },

    // 文件大小格式化
    formatFileSize(bytes) {
        if (typeof bytes !== 'number' || bytes === 0) return '0 B';

        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    },

    // 货币格式化
    formatCurrency(amount, currency = CONFIG.UI.NUMBER_FORMAT.CURRENCY) {
        if (typeof amount !== 'number' || isNaN(amount)) return '--';

        return new Intl.NumberFormat(CONFIG.UI.LANGUAGE, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // 时长格式化
    formatDuration(seconds) {
        if (typeof seconds !== 'number' || isNaN(seconds)) return '--';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${secs}秒`;
        }
    },

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // 防抖函数
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 深度克隆
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));

        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    },

    // 获取状态颜色
    getStatusColor(status) {
        const colors = {
            'completed': CONFIG.CHARTS.COLORS.SUCCESS,
            'running': CONFIG.CHARTS.COLORS.WARNING,
            'failed': CONFIG.CHARTS.COLORS.DANGER,
            'pending': CONFIG.CHARTS.COLORS.SECONDARY,
            'cancelled': CONFIG.CHARTS.COLORS.SECONDARY
        };
        return colors[status] || CONFIG.CHARTS.COLORS.SECONDARY;
    },

    // 获取健康度颜色和状态
    getHealthStatus(percentage) {
        const thresholds = CONFIG.THRESHOLDS.SYSTEM_HEALTH;

        if (percentage >= thresholds.EXCELLENT) {
            return { color: CONFIG.CHARTS.COLORS.SUCCESS, status: '优秀', icon: '💚' };
        } else if (percentage >= thresholds.GOOD) {
            return { color: CONFIG.CHARTS.COLORS.SUCCESS_LIGHT, status: '良好', icon: '✅' };
        } else if (percentage >= thresholds.WARNING) {
            return { color: CONFIG.CHARTS.COLORS.WARNING, status: '警告', icon: '⚠️' };
        } else {
            return { color: CONFIG.CHARTS.COLORS.DANGER, status: '严重', icon: '🚨' };
        }
    },

    // 获取信号强度等级
    getSignalStrengthLevel(score) {
        const thresholds = CONFIG.THRESHOLDS.SIGNAL_STRENGTH;

        if (score >= thresholds.VERY_HIGH) return { level: 'very_high', label: '极高', color: CONFIG.CHARTS.COLORS.SUCCESS };
        if (score >= thresholds.HIGH) return { level: 'high', label: '高', color: CONFIG.CHARTS.COLORS.SUCCESS_LIGHT };
        if (score >= thresholds.MEDIUM) return { level: 'medium', label: '中等', color: CONFIG.CHARTS.COLORS.WARNING };
        return { level: 'low', label: '低', color: CONFIG.CHARTS.COLORS.SECONDARY };
    },

    // 数据验证
    validateData(data, rules) {
        const errors = [];

        for (const [field, rule] of Object.entries(rules)) {
            const value = data[field];

            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} 是必填字段`);
                continue;
            }

            if (value !== undefined && value !== null && value !== '') {
                if (rule.type && typeof value !== rule.type) {
                    errors.push(`${field} 类型错误，期望 ${rule.type}`);
                }

                if (rule.min !== undefined && value < rule.min) {
                    errors.push(`${field} 不能小于 ${rule.min}`);
                }

                if (rule.max !== undefined && value > rule.max) {
                    errors.push(`${field} 不能大于 ${rule.max}`);
                }

                if (rule.pattern && !rule.pattern.test(value)) {
                    errors.push(`${field} 格式不正确`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // 错误处理
    handleError(error, context = '') {
        console.error(`[${context}] 错误:`, error);

        let message = '未知错误';

        if (error.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }

        // 根据错误类型提供更友好的消息
        if (message.includes('Failed to fetch')) {
            message = '网络连接失败，请检查网络连接';
        } else if (message.includes('API key')) {
            message = 'API密钥配置错误，请检查配置';
        } else if (message.includes('403')) {
            message = '访问被拒绝，请检查权限设置';
        } else if (message.includes('404')) {
            message = '数据源不存在，请检查表格ID';
        } else if (message.includes('429')) {
            message = 'API调用频率过高，请稍后重试';
        }

        return {
            message: message,
            originalError: error,
            context: context,
            timestamp: new Date().toISOString()
        };
    },

    // UI操作函数
    showError(message, details = null) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        const errorDetails = document.getElementById('errorDetails');
        const errorStack = document.getElementById('errorStack');

        if (errorMessage) errorMessage.textContent = message;

        if (details && errorDetails && errorStack) {
            errorStack.textContent = JSON.stringify(details, null, 2);
            errorDetails.style.display = 'block';
        } else if (errorDetails) {
            errorDetails.style.display = 'none';
        }

        if (errorModal) {
            errorModal.classList.remove('hidden');
            errorModal.classList.add('fade-in');
        }
    },

    hideError() {
        const errorModal = document.getElementById('errorModal');
        if (errorModal) {
            errorModal.classList.add('hidden');
            errorModal.classList.remove('fade-in');
        }
    },

    showLoading(message = '正在加载数据...') {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingMessage = document.getElementById('loadingMessage');

        if (loadingMessage) loadingMessage.textContent = message;
        if (loadingOverlay) loadingOverlay.style.display = 'flex';

        document.body.style.overflow = 'hidden';
    },

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        document.body.style.overflow = '';
    },

    updateProgress(percentage) {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
    },

    showToast(message, type = 'info', duration = 3000) {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease-in-out'
        });

        // 设置背景色
        const colors = {
            success: CONFIG.CHARTS.COLORS.SUCCESS,
            warning: CONFIG.CHARTS.COLORS.WARNING,
            danger: CONFIG.CHARTS.COLORS.DANGER,
            info: CONFIG.CHARTS.COLORS.INFO
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    // 本地存储操作
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('localStorage 写入失败:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('localStorage 读取失败:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('localStorage 删除失败:', error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('localStorage 清空失败:', error);
                return false;
            }
        }
    },

    // 缓存管理
    cache: new Map(),

    setCache(key, value, ttl = CONFIG.PERFORMANCE.CACHE_DURATION) {
        if (!CONFIG.PERFORMANCE.CACHE_ENABLED) return false;

        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
        return true;
    },

    getCache(key) {
        if (!CONFIG.PERFORMANCE.CACHE_ENABLED) return null;

        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() > cached.expiry) {
            this.cache.delete(key);
            return null;
        }

        return cached.value;
    },

    clearCache() {
        this.cache.clear();
    },

    // 性能监控
    performance: {
        marks: new Map(),

        mark(name) {
            this.marks.set(name, performance.now());
        },

        measure(name, startMark) {
            const start = this.marks.get(startMark);
            if (!start) return null;

            const duration = performance.now() - start;
            console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
            return duration;
        },

        clear() {
            this.marks.clear();
        }
    }
};

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else if (typeof window !== 'undefined') {
    window.Utils = Utils;
}
