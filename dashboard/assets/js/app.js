// 主应用逻辑

class TechIntelligenceApp {
    constructor() {
        this.isInitialized = false;
        this.refreshInterval = null;
        this.data = {};
        
        this.bindEvents();
    }
    
    // 绑定事件
    bindEvents() {
        // 刷新按钮
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        
        // 重试按钮
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                Utils.hideError();
                this.refreshData();
            });
        }
        
        // 错误模态框点击外部关闭
        const errorModal = document.getElementById('errorModal');
        if (errorModal) {
            errorModal.addEventListener('click', (e) => {
                if (e.target === errorModal) {
                    Utils.hideError();
                }
            });
        }
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoRefresh();
            } else {
                this.startAutoRefresh();
                this.refreshData();
            }
        });
    }
    
    // 初始化应用
    async init() {
        try {
            Utils.showLoading();
            
            // 检查配置
            if (!this.validateConfig()) {
                throw new Error('配置验证失败，请检查config.js中的API密钥和表格ID');
            }
            
            // 初始化图表
            dashboardCharts.initCharts();
            
            // 加载初始数据
            await this.loadInitialData();
            
            // 启动自动刷新
            this.startAutoRefresh();
            
            this.isInitialized = true;
            console.log('技术情报仪表板初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            Utils.showError(`初始化失败: ${error.message}`);
        } finally {
            Utils.hideLoading();
        }
    }
    
    // 验证配置
    validateConfig() {
        const config = CONFIG.GOOGLE_SHEETS;
        
        if (!config.API_KEY || config.API_KEY === 'YOUR_GOOGLE_SHEETS_API_KEY') {
            return false;
        }
        
        const spreadsheetIds = Object.values(config.SPREADSHEET_IDS);
        return spreadsheetIds.every(id => id && id !== 'YOUR_CONFIG_DB_SPREADSHEET_ID');
    }
    
    // 加载初始数据
    async loadInitialData() {
        try {
            // 并行加载所有数据
            const [workflowLogs, intelligenceData, qualityReports, rawDataStats] = await Promise.all([
                api.getWorkflowLogs(),
                api.getIntelligenceData(),
                api.getDataQualityReports(),
                api.getRawDataStats()
            ]);
            
            this.data = {
                workflowLogs,
                intelligenceData,
                qualityReports,
                rawDataStats
            };
            
            // 更新UI
            this.updateUI();
            
        } catch (error) {
            console.error('加载初始数据失败:', error);
            throw error;
        }
    }
    
    // 刷新数据
    async refreshData() {
        try {
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
                refreshBtn.disabled = true;
                refreshBtn.textContent = '🔄 刷新中...';
            }
            
            await this.loadInitialData();
            
            // 更新最后刷新时间
            this.updateLastRefreshTime();
            
        } catch (error) {
            console.error('刷新数据失败:', error);
            Utils.showError(`数据刷新失败: ${error.message}`);
        } finally {
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.textContent = '🔄 刷新';
            }
        }
    }
    
    // 更新UI
    updateUI() {
        this.updateMetrics();
        this.updateWorkflowStatus();
        this.updateDataFlow();
        this.updateBusinessValue();
        this.updateLastRefreshTime();
    }
    
    // 更新关键指标
    updateMetrics() {
        const metrics = this.calculateMetrics();
        
        // 系统健康度
        const systemHealthEl = document.querySelector('#systemHealth .metric-value');
        if (systemHealthEl) {
            systemHealthEl.textContent = Utils.formatPercentage(metrics.systemHealth);
            systemHealthEl.style.color = Utils.getHealthColor(metrics.systemHealth);
        }
        
        // 今日情报
        const todayIntelEl = document.querySelector('#todayIntel .metric-value');
        if (todayIntelEl) {
            todayIntelEl.textContent = Utils.formatNumber(metrics.todayIntelligence);
        }
        
        // 告警数量
        const alertCountEl = document.querySelector('#alertCount .metric-value');
        if (alertCountEl) {
            alertCountEl.textContent = Utils.formatNumber(metrics.alertCount);
            alertCountEl.style.color = metrics.alertCount > 0 ? CONFIG.CHARTS.COLORS.DANGER : CONFIG.CHARTS.COLORS.SUCCESS;
        }
        
        // 运行中工作流
        const runningWorkflowsEl = document.querySelector('#runningWorkflows .metric-value');
        if (runningWorkflowsEl) {
            runningWorkflowsEl.textContent = Utils.formatNumber(metrics.runningWorkflows);
        }
    }
    
    // 计算关键指标
    calculateMetrics() {
        const { workflowLogs, intelligenceData } = this.data;
        
        // 系统健康度计算
        const recentLogs = this.getRecentWorkflowLogs(workflowLogs, 24); // 最近24小时
        const totalWorkflows = recentLogs.length;
        const successfulWorkflows = recentLogs.filter(log => log[3] === 'completed').length;
        const systemHealth = totalWorkflows > 0 ? (successfulWorkflows / totalWorkflows) * 100 : 100;
        
        // 今日情报数量
        const today = new Date().toISOString().split('T')[0];
        const todayIntelligence = intelligenceData.filter(intel => 
            intel[20] && intel[20].startsWith(today) // created_timestamp列
        ).length;
        
        // 告警数量（运行失败的工作流）
        const alertCount = recentLogs.filter(log => log[3] === 'failed').length;
        
        // 运行中工作流
        const runningWorkflows = recentLogs.filter(log => log[3] === 'running').length;
        
        return {
            systemHealth,
            todayIntelligence,
            alertCount,
            runningWorkflows
        };
    }
    
    // 获取最近的工作流日志
    getRecentWorkflowLogs(logs, hours) {
        const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        return logs.filter(log => {
            const logTime = new Date(log[4]); // start_timestamp列
            return logTime >= cutoffTime;
        });
    }
    
    // 更新工作流状态
    updateWorkflowStatus() {
        const { workflowLogs } = this.data;
        const workflowStatusEl = document.getElementById('workflowStatus');
        
        if (!workflowStatusEl) return;
        
        // 获取最新的工作流状态
        const latestStatuses = this.getLatestWorkflowStatuses(workflowLogs);
        
        let html = '<div class="workflow-status-list">';
        latestStatuses.forEach(status => {
            const statusColor = Utils.getStatusColor(status.status);
            const statusIcon = this.getStatusIcon(status.status);
            
            html += `
                <div class="workflow-item">
                    <span class="workflow-name">${status.name}</span>
                    <span class="workflow-status" style="color: ${statusColor}">
                        ${statusIcon} ${status.status}
                    </span>
                    <span class="workflow-time">${Utils.formatDateTime(status.time)}</span>
                </div>
            `;
        });
        html += '</div>';
        
        workflowStatusEl.innerHTML = html;
        
        // 更新时间线图表
        this.updateTimelineChart(workflowLogs);
    }
    
    // 获取最新工作流状态
    getLatestWorkflowStatuses(logs) {
        const workflowMap = new Map();
        
        logs.forEach(log => {
            const workflowName = log[1]; // workflow_name列
            const status = log[3]; // execution_status列
            const time = log[4]; // start_timestamp列
            
            if (!workflowMap.has(workflowName) || new Date(time) > new Date(workflowMap.get(workflowName).time)) {
                workflowMap.set(workflowName, {
                    name: workflowName,
                    status: status,
                    time: time
                });
            }
        });
        
        return Array.from(workflowMap.values());
    }
    
    // 获取状态图标
    getStatusIcon(status) {
        const icons = {
            'completed': '✅',
            'running': '🟡',
            'failed': '❌',
            'pending': '⏳'
        };
        return icons[status] || '❓';
    }
    
    // 更新时间线图表
    updateTimelineChart(logs) {
        const recentLogs = this.getRecentWorkflowLogs(logs, 168); // 最近7天
        const dailyStats = this.calculateDailyExecutionStats(recentLogs);
        
        dashboardCharts.updateTimelineChart({
            labels: dailyStats.labels,
            values: dailyStats.avgDuration
        });
    }
    
    // 计算每日执行统计
    calculateDailyExecutionStats(logs) {
        const dailyMap = new Map();
        
        logs.forEach(log => {
            const date = log[4].split('T')[0]; // 提取日期部分
            const duration = parseInt(log[6]) || 0; // duration_seconds列
            
            if (!dailyMap.has(date)) {
                dailyMap.set(date, { totalDuration: 0, count: 0 });
            }
            
            const dayData = dailyMap.get(date);
            dayData.totalDuration += duration;
            dayData.count += 1;
        });
        
        const labels = Array.from(dailyMap.keys()).sort();
        const avgDuration = labels.map(date => {
            const dayData = dailyMap.get(date);
            return dayData.count > 0 ? Math.round(dayData.totalDuration / dayData.count / 60) : 0; // 转换为分钟
        });
        
        return { labels, avgDuration };
    }
    
    // 更新数据流转
    updateDataFlow() {
        const { rawDataStats, intelligenceData } = this.data;
        
        // 计算数据流转统计
        const flowStats = this.calculateDataFlowStats(rawDataStats, intelligenceData);
        
        // 更新漏斗图
        dashboardCharts.updateFunnelChart([
            flowStats.rawData,
            flowStats.signalIdentified,
            flowStats.evidenceVerified,
            flowStats.deepAnalysis,
            flowStats.actionRecommendations
        ]);
        
        // 更新数据质量指标
        this.updateQualityMetrics();
    }
    
    // 计算数据流转统计
    calculateDataFlowStats(rawDataStats, intelligenceData) {
        let rawData = 0;
        Object.values(rawDataStats).forEach(sheetData => {
            rawData += sheetData.length - 1; // 减去标题行
        });
        
        const signalIdentified = intelligenceData.length;
        const evidenceVerified = intelligenceData.filter(intel => intel[11] === 'high').length; // confidence_level列
        const deepAnalysis = intelligenceData.filter(intel => intel[19] === 100).length; // analysis_completion列
        const actionRecommendations = intelligenceData.filter(intel => intel[13] === 'completed').length; // processing_status列
        
        return {
            rawData,
            signalIdentified,
            evidenceVerified,
            deepAnalysis,
            actionRecommendations
        };
    }
    
    // 更新质量指标
    updateQualityMetrics() {
        const { qualityReports } = this.data;
        const qualityMetricsEl = document.getElementById('qualityMetrics');
        
        if (!qualityMetricsEl || !qualityReports.length) return;
        
        const latestReport = qualityReports[qualityReports.length - 1];
        
        let html = '<div class="quality-metrics-list">';
        html += `<div class="quality-item">
            <span class="quality-label">数据完整性</span>
            <span class="quality-value">${Utils.formatPercentage(parseFloat(latestReport[11]) || 0)}</span>
        </div>`;
        html += `<div class="quality-item">
            <span class="quality-label">数据准确性</span>
            <span class="quality-value">${Utils.formatPercentage(parseFloat(latestReport[10]) || 0)}</span>
        </div>`;
        html += `<div class="quality-item">
            <span class="quality-label">数据一致性</span>
            <span class="quality-value">${Utils.formatPercentage(parseFloat(latestReport[12]) || 0)}</span>
        </div>`;
        html += `<div class="quality-item">
            <span class="quality-label">总体质量</span>
            <span class="quality-value">${parseFloat(latestReport[14]) || 0}/10</span>
        </div>`;
        html += '</div>';
        
        qualityMetricsEl.innerHTML = html;
    }
    
    // 更新业务价值
    updateBusinessValue() {
        const { intelligenceData } = this.data;
        
        // 更新价值矩阵散点图
        const scatterData = intelligenceData.map(intel => ({
            x: parseFloat(intel[10]) || 0, // commercial_value_score列
            y: parseFloat(intel[9]) || 0   // breakthrough_score列
        }));
        
        dashboardCharts.updateScatterChart(scatterData);
        
        // 更新TOP情报列表
        this.updateTopIntelligence(intelligenceData);
    }
    
    // 更新TOP情报
    updateTopIntelligence(intelligenceData) {
        const topIntelligenceEl = document.getElementById('topIntelligence');
        if (!topIntelligenceEl) return;
        
        // 按信号强度排序，取前5个
        const topIntel = intelligenceData
            .filter(intel => intel[8]) // 有信号强度的记录
            .sort((a, b) => parseFloat(b[8]) - parseFloat(a[8])) // 按信号强度降序
            .slice(0, 5);
        
        let html = '<div class="top-intelligence-list">';
        html += '<h4>🏆 TOP情报</h4>';
        
        topIntel.forEach((intel, index) => {
            const title = intel[3] || '未知标题'; // title列
            const signalStrength = parseFloat(intel[8]) || 0; // signal_strength列
            const dataType = intel[5] || '未知类型'; // data_type列
            
            html += `
                <div class="intelligence-item">
                    <div class="intelligence-rank">#${index + 1}</div>
                    <div class="intelligence-content">
                        <div class="intelligence-title">${title.substring(0, 50)}...</div>
                        <div class="intelligence-meta">
                            <span class="intelligence-type">${dataType}</span>
                            <span class="intelligence-score">信号强度: ${signalStrength.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        topIntelligenceEl.innerHTML = html;
    }
    
    // 更新最后刷新时间
    updateLastRefreshTime() {
        const now = new Date();
        const timeString = Utils.formatDateTime(now);
        
        const lastUpdateEl = document.getElementById('lastUpdate');
        const footerUpdateEl = document.getElementById('footerUpdate');
        
        if (lastUpdateEl) {
            lastUpdateEl.textContent = `最后更新: ${timeString}`;
        }
        
        if (footerUpdateEl) {
            footerUpdateEl.textContent = timeString;
        }
    }
    
    // 启动自动刷新
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, CONFIG.REFRESH.AUTO_REFRESH_INTERVAL);
    }
    
    // 停止自动刷新
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    // 销毁应用
    destroy() {
        this.stopAutoRefresh();
        dashboardCharts.destroyCharts();
        this.isInitialized = false;
    }
}

// 创建应用实例
const app = new TechIntelligenceApp();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    app.destroy();
});

// 导出应用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TechIntelligenceApp, app };
} else if (typeof window !== 'undefined') {
    window.TechIntelligenceApp = TechIntelligenceApp;
    window.app = app;
}
