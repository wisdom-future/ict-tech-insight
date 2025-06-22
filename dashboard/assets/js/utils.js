// 工具函数库

const Utils = {
    // 格式化日期时间
    formatDateTime(dateString) {
        if (!dateString || dateString === '--') return '--';
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // 格式化数字
    formatNumber(num) {
        if (typeof num !== 'number') return '--';
        return num.toLocaleString('zh-CN');
    },
    
    // 格式化百分比
    formatPercentage(num) {
        if (typeof num !== 'number') return '--';
        return `${num.toFixed(1)}%`;
    },
    
    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 获取状态颜色
    getStatusColor(status) {
        const colors = {
            'completed': CONFIG.CHARTS.COLORS.SUCCESS,
            'running': CONFIG.CHARTS.COLORS.WARNING,
            'failed': CONFIG.CHARTS.COLORS.DANGER,
            'pending': CONFIG.CHARTS.COLORS.SECONDARY
        };
        return colors[status] || CONFIG.CHARTS.COLORS.SECONDARY;
    },
    
    // 获取健康度颜色
    getHealthColor(percentage) {
        if (percentage >= CONFIG.THRESHOLDS.SYSTEM_HEALTH.GOOD) {
            return CONFIG.CHARTS.COLORS.SUCCESS;
        } else if (percentage >= CONFIG.THRESHOLDS.SYSTEM_HEALTH.WARNING) {
            return CONFIG.CHARTS.COLORS.WARNING;
        } else {
            return CONFIG.CHARTS.COLORS.DANGER;
        }
    },
    
    // 显示错误消息
    showError(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
    },
    
    // 隐藏错误消息
    hideError() {
        const errorModal = document.getElementById('errorModal');
        errorModal.classList.add('hidden');
    },
    
    // 显示加载状态
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';
    },
    
    // 隐藏加载状态
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'none';
    }
};

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else if (typeof window !== 'undefined') {
    window.Utils = Utils;
}
