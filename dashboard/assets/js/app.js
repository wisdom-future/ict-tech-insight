// 主应用逻辑增强版

class TechIntelligenceApp {
    constructor() {
        this.isInitialized = false;
        this.refreshInterval = null;
        this.data = {};
        this.settings = this.loadSettings();
        this.lastUpdateTime = null;
        this.connectionStatus = 'unknown';
        
        this.bindEvents();
        this.setupErrorHandling();
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
        
        // 设置按钮
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.toggleSettings());
        }
        
        // 关闭错误模态框
        const closeError = document.getElementById('closeError');
        if (closeError) {
            closeError.addEventListener('click', () => Utils.hideError());
        }
        
        // 关闭设置面板
        const closeSettings = document.getElementById('closeSettings');
        if (closeSettings) {
            closeSettings.addEventListener('click', () => this.toggleSettings());
        }
        
        // 保存设置
        const saveSettings = document.getElementById('saveSettings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveSettings());
        }
        
        // 重置设置
        const resetSettings = document.getElementById('resetSettings');
        if (resetSettings) {
            resetSettings.addEventListener('click', () => this.resetSettings());
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
                if (this.shouldRefreshOnFocus()) {
                    this.refreshData();
                }
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshData();
                        break;
                    case ',':
                        e.preventDefault();
                        this.toggleSettings();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                Utils.hideError();
                this.closeSettings();
            }
        });
        
        // 时间范围选择
        const timeRangeSelect = document.getElementById('timeRangeSelect');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                                    this.updateTimeRange(e.target.value);
            });
        }
        
        // 排行标准选择
        const rankingCriteria = document.getElementById('rankingCriteria');
        if (rankingCriteria) {
            rankingCriteria.addEventListener('change', (e) => {
                this.updateRanking(e.target.value);
            });
        }
        
        // 工作流详细视图切换
        const workflowToggle = document.getElementById('workflowToggle');
        if (workflowToggle) {
            workflowToggle.addEventListener('click', () => this.toggleWorkflowView());
        }
    }
    
    // 设置错误处理
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('全局错误:', e.error);
            if (CONFIG.ERROR_HANDLING.LOG_ERRORS) {
                this.logError(e.error, 'global');
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('未处理的Promise拒绝:', e.reason);
            if (CONFIG.ERROR_HANDLING.LOG_ERRORS) {
                this.logError(e.reason, 'promise');
            }
        });
    }
    
    // 初始化应用
    async init() {
        try {
            Utils.showLoading('初始化技术洞察系统...');
            Utils.updateProgress(10);
            
            // 检查配置
            const configValidation = CONFIG.validate();
            if (!configValidation.isValid) {
                throw new Error(`配置验证失败:\n${configValidation.errors.join('\n')}`);
            }
            Utils.updateProgress(20);
            
            // 测试API连接
            Utils.showLoading('测试API连接...');
            const connectionTest = await api.testConnection();
            if (!connectionTest.success) {
                throw new Error(`API连接失败: ${connectionTest.message}`);
            }
            this.updateConnectionStatus('connected');
            Utils.updateProgress(40);
            
            // 初始化图表
            Utils.showLoading('初始化图表组件...');
            dashboardCharts.initCharts();
            Utils.updateProgress(60);
            
            // 加载初始数据
            Utils.showLoading('加载洞察数据...');
            await this.loadInitialData();
            Utils.updateProgress(80);
            
            // 应用用户设置
            this.applySettings();
            Utils.updateProgress(90);
            
            // 启动自动刷新
            this.startAutoRefresh();
            Utils.updateProgress(100);
            
            this.isInitialized = true;
            this.updateSystemStatus('healthy', '系统运行正常');
            
            Utils.showToast('技术洞察系统初始化完成', 'success');
            console.log('技术洞察仪表板初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.updateSystemStatus('error', '初始化失败');
            this.updateConnectionStatus('error');
            Utils.showError(`初始化失败: ${error.message}`, error);
        } finally {
            Utils.hideLoading();
        }
    }
    
    // 加载初始数据
    async loadInitialData() {
        try {
            Utils.performance.mark('data_load_start');
            
            // 并行加载所有数据
            const [
                configData,
                rawDataStats,
                intelligenceData,
                operationsData
            ] = await Promise.all([
                api.getAllConfigData(),
                api.getAllRawDataStats(),
                api.getAllIntelligenceData(),
                api.getAllOperationsData()
            ]);
            
            this.data = {
                config: configData,
                rawData: rawDataStats,
                intelligence: intelligenceData,
                operations: operationsData,
                lastUpdate: new Date()
            };
            
            // 处理数据
            this.processData();
            
            // 更新UI
            this.updateUI();
            
            Utils.performance.measure('数据加载完成', 'data_load_start');
            
        } catch (error) {
            console.error('加载初始数据失败:', error);
            throw error;
        }
    }
    
    // 处理数据
    processData() {
        try {
            // 处理工作流数据
            if (this.data.operations.WORKFLOW_EXECUTION_LOG) {
                this.data.processedWorkflows = api.processWorkflowData(
                    this.data.operations.WORKFLOW_EXECUTION_LOG
                );
            }
            
            // 处理洞察数据
            if (this.data.intelligence.TECH_INTELLIGENCE_MASTER) {
                this.data.processedIntelligence = api.processIntelligenceData(
                    this.data.intelligence.TECH_INTELLIGENCE_MASTER
                );
            }
            
            // 处理质量数据
            if (this.data.operations.DATA_QUALITY_REPORTS) {
                this.data.processedQuality = api.processQualityData(
                    this.data.operations.DATA_QUALITY_REPORTS
                );
            }
            
        } catch (error) {
            console.error('数据处理失败:', error);
        }
    }
    
    // 刷新数据
    async refreshData() {
        if (!this.isInitialized) {
            console.warn('系统未初始化，跳过数据刷新');
            return;
        }
        
        try {
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
                refreshBtn.disabled = true;
                refreshBtn.textContent = '🔄 刷新中...';
            }
            
            Utils.performance.mark('refresh_start');
            
            await this.loadInitialData();
            
            // 更新最后刷新时间
            this.lastUpdateTime = new Date();
            this.updateLastRefreshTime();
            
            Utils.performance.measure('数据刷新完成', 'refresh_start');
            Utils.showToast('数据刷新完成', 'success', 2000);
            
        } catch (error) {
            console.error('刷新数据失败:', error);
            this.updateConnectionStatus('error');
            Utils.showError(`数据刷新失败: ${error.message}`, error);
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
        try {
            this.updateMetrics();
            this.updateWorkflowStatus();
            this.updateDataFlow();
            this.updateBusinessValue();
            this.updateTechTrends();
            this.updateLastRefreshTime();
        } catch (error) {
            console.error('UI更新失败:', error);
        }
    }
    
    // 更新关键指标
    updateMetrics() {
        const metrics = this.calculateMetrics();
        
        // 系统健康度
        this.updateMetricCard('systemHealth', {
            value: Utils.formatPercentage(metrics.systemHealth),
            trend: this.calculateTrend('systemHealth', metrics.systemHealth),
            color: Utils.getHealthStatus(metrics.systemHealth).color,
            icon: Utils.getHealthStatus(metrics.systemHealth).icon
        });
        
        // 今日洞察
        this.updateMetricCard('todayIntel', {
            value: Utils.formatNumber(metrics.todayIntelligence),
            trend: this.calculateTrend('todayIntel', metrics.todayIntelligence),
            color: CONFIG.CHARTS.COLORS.PRIMARY
        });
        
        // 告警数量
        this.updateMetricCard('alertCount', {
            value: Utils.formatNumber(metrics.alertCount),
            trend: this.calculateTrend('alertCount', metrics.alertCount),
            color: metrics.alertCount > 0 ? CONFIG.CHARTS.COLORS.DANGER : CONFIG.CHARTS.COLORS.SUCCESS
        });
        
        // 运行中工作流
        this.updateMetricCard('runningWorkflows', {
            value: Utils.formatNumber(metrics.runningWorkflows),
            trend: this.calculateTrend('runningWorkflows', metrics.runningWorkflows),
            color: CONFIG.CHARTS.COLORS.WARNING
        });
    }
    
    // 更新指标卡片
    updateMetricCard(cardId, data) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        const valueEl = card.querySelector('.metric-value');
        const trendEl = card.querySelector('.metric-trend');
        const iconEl = card.querySelector('.metric-icon');
        
        if (valueEl) {
            valueEl.textContent = data.value;
            if (data.color) {
                valueEl.style.color = data.color;
            }
        }
        
        if (trendEl && data.trend) {
            trendEl.textContent = data.trend.text;
            trendEl.className = `metric-trend ${data.trend.type}`;
        }
        
        if (iconEl && data.icon) {
            iconEl.textContent = data.icon;
        }
        
        // 添加动画效果
        card.classList.add('fade-in');
        setTimeout(() => card.classList.remove('fade-in'), 300);
    }
    
    // 计算趋势
    calculateTrend(metric, currentValue) {
        // 这里可以实现基于历史数据的趋势计算
        // 暂时返回默认值
        return {
            text: '与昨日持平',
            type: 'neutral'
        };
    }
    
    // 计算关键指标
    calculateMetrics() {
        const workflowLogs = this.data.processedWorkflows || [];
        const intelligenceData = this.data.processedIntelligence || [];
        
        // 系统健康度计算
        const recentLogs = this.getRecentWorkflowLogs(workflowLogs, 24);
        const totalWorkflows = recentLogs.length;
        const successfulWorkflows = recentLogs.filter(log => log.executionStatus === 'completed').length;
        const systemHealth = totalWorkflows > 0 ? (successfulWorkflows / totalWorkflows) * 100 : 100;
        
        // 今日洞察数量
        const today = new Date().toISOString().split('T')[0];
        const todayIntelligence = intelligenceData.filter(intel => 
            intel.createdTimestamp && intel.createdTimestamp.startsWith(today)
        ).length;
        
        // 告警数量
        const alertCount = recentLogs.filter(log => log.executionStatus === 'failed').length;
        
        // 运行中工作流
        const runningWorkflows = recentLogs.filter(log => log.executionStatus === 'running').length;
        
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
            const logTime = new Date(log.startTimestamp);
            return logTime >= cutoffTime;
        });
    }
    
    // 更新工作流状态
    updateWorkflowStatus() {
        const workflowLogs = this.data.processedWorkflows || [];
        const workflowListEl = document.getElementById('workflowList');
        
        if (!workflowListEl) return;
        
        const latestStatuses = this.getLatestWorkflowStatuses(workflowLogs);
        
        let html = '';
        latestStatuses.forEach(status => {
            const statusColor = Utils.getStatusColor(status.executionStatus);
            const statusIcon = this.getStatusIcon(status.executionStatus);
            
            html += `
                <div class="workflow-item">
                    <div class="workflow-name">${status.workflowName}</div>
                    <div class="workflow-status" style="color: ${statusColor}">
                        ${statusIcon} ${this.getStatusText(status.executionStatus)}
                    </div>
                    <div class="workflow-time">${Utils.formatDateTime(status.startTimestamp, 'short')}</div>
                </div>
            `;
        });
        
        workflowListEl.innerHTML = html || '<div class="loading">暂无工作流数据</div>';
        
        // 更新时间线图表
        this.updateTimelineChart(workflowLogs);
    }
    
    // 获取最新工作流状态
    getLatestWorkflowStatuses(logs) {
        const workflowMap = new Map();
        
        logs.forEach(log => {
            const workflowName = log.workflowName;
            if (!workflowMap.has(workflowName) || 
                new Date(log.startTimestamp) > new Date(workflowMap.get(workflowName).startTimestamp)) {
                workflowMap.set(workflowName, log);
            }
        });
        
        return Array.from(workflowMap.values()).sort((a, b) => 
            new Date(b.startTimestamp) - new Date(a.startTimestamp)
        );
    }
    
    // 获取状态图标
    getStatusIcon(status) {
        const icons = {
            'completed': '✅',
            'running': '🟡',
            'failed': '❌',
            'pending': '⏳',
            'cancelled': '⏹️'
        };
        return icons[status] || '❓';
    }
    
    // 获取状态文本
    getStatusText(status) {
        const texts = {
            'completed': '已完成',
            'running': '运行中',
            'failed': '失败',
            'pending': '等待中',
            'cancelled': '已取消'
        };
        return texts[status] || '未知';
    }
    
    // 更新时间线图表
    updateTimelineChart(logs) {
        const timeRange = this.settings.timeRange || '24h';
        const chartData = this.calculateTimelineData(logs, timeRange);
        
        dashboardCharts.updateTimelineChart(chartData);
    }
    
    // 计算时间线数据
    calculateTimelineData(logs, timeRange) {
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const recentLogs = this.getRecentWorkflowLogs(logs, hours);
        
        // 按时间分组
        const groupedData = this.groupLogsByTime(recentLogs, timeRange);
        
        const labels = Object.keys(groupedData).sort();
        const durations = labels.map(time => {
            const timeLogs = groupedData[time];
            const avgDuration = timeLogs.reduce((sum, log) => sum + log.durationSeconds, 0) / timeLogs.length;
            return Math.round(avgDuration / 60); // 转换为分钟
        });
        
        const successRates = labels.map(time => {
            const timeLogs = groupedData[time];
            const successCount = timeLogs.filter(log => log.executionStatus === 'completed').length;
            return (successCount / timeLogs.length) * 100;
        });
        
        return { labels, durations, successRates };
    }
    
    // 按时间分组日志
    groupLogsByTime(logs, timeRange) {
        const grouped = {};
        
        logs.forEach(log => {
            let timeKey;
            const logTime = new Date(log.startTimestamp);
            
            if (timeRange === '24h') {
                timeKey = `${logTime.getHours()}:00`;
            } else if (timeRange === '7d') {
                timeKey = logTime.toISOString().split('T')[0];
            } else {
                timeKey = `${logTime.getFullYear()}-${(logTime.getMonth() + 1).toString().padStart(2, '0')}`;
            }
            
            if (!grouped[timeKey]) {
                grouped[timeKey] = [];
            }
            grouped[timeKey].push(log);
        });
        
        return grouped;
    }
    
    // 更新数据流转
    updateDataFlow() {
        const rawDataStats = this.data.rawData || {};
        const intelligenceData = this.data.processedIntelligence || [];
        
        // 计算数据流转统计
        const flowStats = this.calculateDataFlowStats(rawDataStats, intelligenceData);
        
        // 更新流转统计
        this.updateFlowStats(flowStats);
        
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
            if (Array.isArray(sheetData)) {
                rawData += Math.max(0, sheetData.length - 1); // 减去标题行
            }
        });
        
        const signalIdentified = intelligenceData.length;
        const evidenceVerified = intelligenceData.filter(intel => 
            intel.confidenceLevel === 'high'
        ).length;
        const deepAnalysis = intelligenceData.filter(intel => 
            intel.processingStatus === 'completed'
        ).length;
        const actionRecommendations = Math.floor(deepAnalysis * 0.6); // 估算
        
        return {
            rawData,
            signalIdentified,
            evidenceVerified,
            deepAnalysis,
            actionRecommendations
        };
    }
    
    // 更新流转统计
    updateFlowStats(stats) {
        const processingEfficiency = document.getElementById('processingEfficiency');
        const conversionRate = document.getElementById('conversionRate');
        const totalInput = document.getElementById('totalInput');
        const totalOutput = document.getElementById('totalOutput');
        
        if (processingEfficiency) {
            const efficiency = stats.rawData > 0 ? 
                ((stats.signalIdentified / stats.rawData) * 100).toFixed(1) : 0;
            processingEfficiency.textContent = `${efficiency}%`;
        }
        
        if (conversionRate) {
            const conversion = stats.signalIdentified > 0 ? 
                ((stats.actionRecommendations / stats.signalIdentified) * 100).toFixed(1) : 0;
            conversionRate.textContent = `${conversion}%`;
        }
        
        if (totalInput) {
            totalInput.textContent = Utils.formatNumber(stats.rawData);
        }
        
        if (totalOutput) {
            totalOutput.textContent = Utils.formatNumber(stats.actionRecommendations);
        }
    }
    
    // 更新质量指标
    updateQualityMetrics() {
        const qualityData = this.data.processedQuality || [];
        const qualityGridEl = document.getElementById('qualityGrid');
        const overallQualityEl = document.getElementById('overallQuality');
        
        if (!qualityGridEl) return;
        
        if (qualityData.length === 0) {
            qualityGridEl.innerHTML = '<div class="loading">暂无质量数据</div>';
            return;
        }
        
        const latestReport = qualityData[qualityData.length - 1];
        
        // 更新总体评分
        if (overallQualityEl) {
            const scoreValue = overallQualityEl.querySelector('.score-value');
            if (scoreValue) {
                scoreValue.textContent = `${latestReport.overallQualityScore.toFixed(1)}/10`;
                scoreValue.style.color = this.getQualityColor(latestReport.overallQualityScore);
            }
        }
        
        // 更新质量指标网格
        let html = '';
        const metrics = [
            { label: '完整性', value: latestReport.dataCompletenessPercentage },
            { label: '准确性', value: latestReport.dataAccuracyPercentage },
            { label: '一致性', value: latestReport.dataConsistencyPercentage },
            { label: '及时性', value: 85 } // 示例值
        ];
        
        metrics.forEach(metric => {
            html += `
                <div class="quality-item">
                    <span class="quality-label">${metric.label}</span>
                    <span class="quality-value" style="color: ${this.getQualityColor(metric.value / 10)}">
                        ${Utils.formatPercentage(metric.value)}
                    </span>
                </div>
            `;
        });
        
        qualityGridEl.innerHTML = html;
    }
    
    // 获取质量颜色
    getQualityColor(score) {
        const thresholds = CONFIG.THRESHOLDS.DATA_QUALITY;
        
        if (score >= thresholds.EXCELLENT) return CONFIG.CHARTS.COLORS.SUCCESS;
        if (score >= thresholds.GOOD) return CONFIG.CHARTS.COLORS.SUCCESS_LIGHT;
        if (score >= thresholds.ACCEPTABLE) return CONFIG.CHARTS.COLORS.WARNING;
        return CONFIG.CHARTS.COLORS.DANGER;
    }
    
    // 更新业务价值
    updateBusinessValue() {
        const intelligenceData = this.data.processedIntelligence || [];
        
        // 更新价值统计
        this.updateValueSummary(intelligenceData);
        
        // 更新价值矩阵散点图
        const scatterData = intelligenceData.map(intel => ({
            commercialValue: intel.commercialValueScore,
            technicalBreakthrough: intel.breakthroughScore,
            dataType: intel.dataType,
            title: intel.title,
            id: intel.intelligenceId
        }));
        
        dashboardCharts.updateScatterChart(scatterData);
        
        // 更新TOP洞察列表
        this.updateTopIntelligence(intelligenceData);
    }
    
    // 更新价值统计
    updateValueSummary(intelligenceData) {
        const highValueCount = document.getElementById('highValueCount');
        const investmentOpportunities = document.getElementById('investmentOpportunities');
        
        if (highValueCount) {
            const highValue = intelligenceData.filter(intel => 
                intel.signalStrength >= CONFIG.THRESHOLDS.SIGNAL_STRENGTH.HIGH
            ).length;
            highValueCount.textContent = Utils.formatNumber(highValue);
        }
        
        if (investmentOpportunities) {
            const opportunities = intelligenceData.filter(intel => 
                intel.commercialValueScore >= 8.0 && intel.breakthroughScore >= 7.0
            ).length;
            investmentOpportunities.textContent = Utils.formatNumber(opportunities);
        }
    }
    
    // 更新TOP洞察
    updateTopIntelligence(intelligenceData) {
        const intelligenceListEl = document.getElementById('intelligenceList');
        if (!intelligenceListEl) return;
        
        const criteria = this.settings.rankingCriteria || 'signal_strength';
        const sortField = criteria === 'signal_strength' ? 'signalStrength' :
                        criteria === 'commercial_value' ? 'commercialValueScore' : 'breakthroughScore';
        
        const topIntel = intelligenceData
            .filter(intel => intel[sortField] > 0)
            .sort((a, b) => b[sortField] - a[sortField])
            .slice(0, 10);
        
        let html = '';
        
        if (topIntel.length === 0) {
            html = '<div class="loading">暂无洞察数据</div>';
        } else {
            topIntel.forEach((intel, index) => {
                const levelInfo = Utils.getSignalStrengthLevel(intel.signalStrength);
                
                html += `
                    <div class="intelligence-item">
                        <div class="intelligence-rank" style="background: ${levelInfo.color}">
                            #${index + 1}
                        </div>
                        <div class="intelligence-content">
                            <div class="intelligence-title" title="${intel.title}">
                                ${intel.title ? intel.title.substring(0, 60) + '...' : '无标题'}
                            </div>
                            <div class="intelligence-meta">
                                <span class="intelligence-type">${this.getDataTypeText(intel.dataType)}</span>
                                <span class="intelligence-score">
                                    ${this.getCriteriaText(criteria)}: ${intel[sortField].toFixed(1)}
                                </span>
                                <span class="intelligence-time">
                                    ${Utils.formatDateTime(intel.createdTimestamp, 'relative')}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        intelligenceListEl.innerHTML = html;
    }
    
    // 获取数据类型文本
    getDataTypeText(dataType) {
        const types = {
            'academic_papers': '学术论文',
            'patent_data': '专利数据',
            'tech_news': '技术新闻',
            'opensource_data': '开源项目',
            'industry_dynamics': '产业动态',
            'competitor_intelligence': '竞争洞察'
        };
        return types[dataType] || dataType;
    }
    
    // 获取排序标准文本
    getCriteriaText(criteria) {
        const texts = {
            'signal_strength': '信号强度',
            'commercial_value': '商业价值',
            'breakthrough_score': '技术突破性'
        };
        return texts[criteria] || criteria;
    }
    
    // 更新技术趋势
    updateTechTrends() {
        const intelligenceData = this.data.processedIntelligence || [];
        
        // 生成技术热度数据
        const techHeatmap = this.generateTechHeatmap(intelligenceData);
        this.updateTechHeatmap(techHeatmap);
        
        // 更新趋势统计
        const trendsStats = this.calculateTrendsStats(intelligenceData);
        this.updateTrendsStats(trendsStats);
    }
    
    // 生成技术热度图数据
    generateTechHeatmap(intelligenceData) {
        const techCount = {};
        
        intelligenceData.forEach(intel => {
            const keyword = intel.techKeyword || '未分类';
            if (!techCount[keyword]) {
                techCount[keyword] = { count: 0, totalScore: 0 };
            }
            techCount[keyword].count++;
            techCount[keyword].totalScore += intel.signalStrength;
        });
        
        return Object.entries(techCount).map(([tech, data]) => ({
            name: tech,
            count: data.count,
            avgScore: data.totalScore / data.count,
            heat: data.count * (data.totalScore / data.count) // 热度值
        })).sort((a, b) => b.heat - a.heat);
    }
    
    // 更新技术热度图
    updateTechHeatmap(heatmapData) {
        const heatmapContainer = document.getElementById('heatmapContainer');
        if (!heatmapContainer) return;
        
        if (heatmapData.length === 0) {
            heatmapContainer.innerHTML = '<div class="loading">暂无技术趋势数据</div>';
            return;
        }
        
        // 简单的热度图实现
        let html = '<div class="heatmap-grid">';
        const maxHeat = Math.max(...heatmapData.map(item => item.heat));
        
        heatmapData.slice(0, 20).forEach(item => {
            const intensity = (item.heat / maxHeat) * 100;
            const color = this.getHeatColor(intensity);
            
            html += `
                <div class="heatmap-item" style="background: ${color}" title="${item.name}: ${item.count}条洞察">
                    <span class="heatmap-label">${item.name}</span>
                    <span class="heatmap-value">${item.count}</span>
                </div>
            `;
        });
        
        html += '</div>';
        heatmapContainer.innerHTML = html;
    }
    
    // 获取热度颜色
    getHeatColor(intensity) {
        const alpha = Math.max(0.1, intensity / 100);
        return `rgba(37, 99, 235, ${alpha})`;
    }
    
    // 计算趋势统计
    calculateTrendsStats(intelligenceData) {
        const stats = [];
        
        // 按数据类型统计
        const typeStats = {};
        intelligenceData.forEach(intel => {
                            const type = intel.dataType || 'unknown';
            if (!typeStats[type]) {
                typeStats[type] = { count: 0, avgScore: 0, totalScore: 0 };
            }
            typeStats[type].count++;
            typeStats[type].totalScore += intel.signalStrength;
        });
        
        Object.entries(typeStats).forEach(([type, data]) => {
            data.avgScore = data.totalScore / data.count;
            stats.push({
                name: this.getDataTypeText(type),
                value: `${data.count}条 (平均${data.avgScore.toFixed(1)}分)`,
                count: data.count,
                score: data.avgScore
            });
        });
        
        return stats.sort((a, b) => b.count - a.count);
    }
    
    // 更新趋势统计
    updateTrendsStats(stats) {
        const trendsListEl = document.getElementById('trendsList');
        if (!trendsListEl) return;
        
        if (stats.length === 0) {
            trendsListEl.innerHTML = '<div class="loading">暂无趋势统计数据</div>';
            return;
        }
        
        let html = '';
        stats.forEach(stat => {
            const color = this.getQualityColor(stat.score);
            html += `
                <div class="trend-item">
                    <span class="trend-name">${stat.name}</span>
                    <span class="trend-value" style="color: ${color}">${stat.value}</span>
                </div>
            `;
        });
        
        trendsListEl.innerHTML = html;
    }
    
    // 更新时间范围
    updateTimeRange(range) {
        this.settings.timeRange = range;
        this.saveSettings();
        
        // 重新计算时间线数据
        if (this.data.processedWorkflows) {
            this.updateTimelineChart(this.data.processedWorkflows);
        }
    }
    
    // 更新排行标准
    updateRanking(criteria) {
        this.settings.rankingCriteria = criteria;
        this.saveSettings();
        
        // 重新更新TOP洞察列表
        if (this.data.processedIntelligence) {
            this.updateTopIntelligence(this.data.processedIntelligence);
        }
    }
    
    // 切换工作流视图
    toggleWorkflowView() {
        const toggle = document.getElementById('workflowToggle');
        const workflowList = document.getElementById('workflowList');
        
        if (!toggle || !workflowList) return;
        
        const isDetailed = toggle.textContent.includes('简化');
        
        if (isDetailed) {
            toggle.textContent = '详细视图';
            workflowList.classList.add('compact-view');
        } else {
            toggle.textContent = '简化视图';
            workflowList.classList.remove('compact-view');
        }
    }
    
    // 更新系统状态
    updateSystemStatus(status, message) {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (statusIndicator) {
            const indicators = {
                'healthy': '🟢',
                'warning': '🟡',
                'error': '🔴',
                'unknown': '⚪'
            };
            statusIndicator.textContent = indicators[status] || '⚪';
        }
        
        if (statusText) {
            statusText.textContent = message || '状态未知';
        }
    }
    
    // 更新连接状态
    updateConnectionStatus(status) {
        this.connectionStatus = status;
        const apiStatusEl = document.getElementById('apiStatus');
        
        if (apiStatusEl) {
            const statuses = {
                'connected': { text: 'API连接正常', class: '' },
                'error': { text: 'API连接异常', class: 'error' },
                'unknown': { text: 'API状态未知', class: 'error' }
            };
            
            const statusInfo = statuses[status] || statuses.unknown;
            apiStatusEl.textContent = statusInfo.text;
            apiStatusEl.className = `api-status ${statusInfo.class}`;
        }
    }
    
    // 更新最后刷新时间
    updateLastRefreshTime() {
        const now = this.lastUpdateTime || new Date();
        const timeString = Utils.formatDateTime(now);
        
        const lastUpdateEl = document.getElementById('lastUpdate');
        const footerUpdateEl = document.getElementById('footerUpdate');
        
        if (lastUpdateEl) {
            lastUpdateEl.textContent = `最后更新: ${Utils.formatDateTime(now, 'short')}`;
        }
        
        if (footerUpdateEl) {
            footerUpdateEl.textContent = timeString;
        }
    }
    
    // 判断是否需要在焦点时刷新
    shouldRefreshOnFocus() {
        if (!this.lastUpdateTime) return true;
        
        const timeSinceUpdate = Date.now() - this.lastUpdateTime.getTime();
        const refreshThreshold = this.settings.refreshInterval || CONFIG.REFRESH.AUTO_REFRESH_INTERVAL;
        
        return timeSinceUpdate > refreshThreshold;
    }
    
    // 设置管理
    loadSettings() {
        const defaultSettings = {
            refreshInterval: CONFIG.REFRESH.AUTO_REFRESH_INTERVAL,
            chartAnimation: CONFIG.CHARTS.ANIMATION.ENABLED,
            darkMode: false,
            timeRange: '24h',
            rankingCriteria: 'signal_strength'
        };
        
        const saved = Utils.storage.get('dashboard_settings', defaultSettings);
        return { ...defaultSettings, ...saved };
    }
    
    saveSettings() {
        // 从UI读取设置
        const refreshInterval = document.getElementById('refreshInterval');
        const chartAnimation = document.getElementById('chartAnimation');
        const darkMode = document.getElementById('darkMode');
        
        if (refreshInterval) {
            this.settings.refreshInterval = parseInt(refreshInterval.value);
        }
        
        if (chartAnimation) {
            this.settings.chartAnimation = chartAnimation.checked;
        }
        
        if (darkMode) {
            this.settings.darkMode = darkMode.checked;
        }
        
        // 保存到本地存储
        Utils.storage.set('dashboard_settings', this.settings);
        
        // 应用设置
        this.applySettings();
        
        Utils.showToast('设置已保存', 'success');
    }
    
    resetSettings() {
        this.settings = this.loadSettings();
        this.applySettingsToUI();
        this.applySettings();
        
        Utils.showToast('设置已重置', 'info');
    }
    
    applySettings() {
        // 应用刷新间隔
        if (this.settings.refreshInterval !== CONFIG.REFRESH.AUTO_REFRESH_INTERVAL) {
            CONFIG.REFRESH.AUTO_REFRESH_INTERVAL = this.settings.refreshInterval;
            this.stopAutoRefresh();
            this.startAutoRefresh();
        }
        
        // 应用图表动画
        if (dashboardCharts) {
            dashboardCharts.toggleAnimation(this.settings.chartAnimation);
        }
        
        // 应用深色模式
        this.applyDarkMode(this.settings.darkMode);
        
        // 应用到UI
        this.applySettingsToUI();
    }
    
    applySettingsToUI() {
        const refreshInterval = document.getElementById('refreshInterval');
        const chartAnimation = document.getElementById('chartAnimation');
        const darkMode = document.getElementById('darkMode');
        const timeRangeSelect = document.getElementById('timeRangeSelect');
        const rankingCriteria = document.getElementById('rankingCriteria');
        
        if (refreshInterval) refreshInterval.value = this.settings.refreshInterval;
        if (chartAnimation) chartAnimation.checked = this.settings.chartAnimation;
        if (darkMode) darkMode.checked = this.settings.darkMode;
        if (timeRangeSelect) timeRangeSelect.value = this.settings.timeRange;
        if (rankingCriteria) rankingCriteria.value = this.settings.rankingCriteria;
    }
    
    applyDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    toggleSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (!settingsPanel) return;
        
        settingsPanel.classList.toggle('hidden');
    }
    
    closeSettings() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.add('hidden');
        }
    }
    
    // 自动刷新管理
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        if (CONFIG.FEATURES.AUTO_REFRESH) {
            this.refreshInterval = setInterval(() => {
                if (!document.hidden) {
                    this.refreshData();
                }
            }, CONFIG.REFRESH.AUTO_REFRESH_INTERVAL);
        }
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    // 错误日志
    logError(error, context) {
        const errorLog = {
            error: error.toString(),
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            stack: error.stack || 'No stack trace'
        };
        
        console.error('错误日志:', errorLog);
        
        // 这里可以发送到错误监控服务
        if (CONFIG.ERROR_HANDLING.SENTRY_DSN) {
            // 发送到Sentry或其他错误监控服务
        }
    }
    
    // 获取系统状态
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            connectionStatus: this.connectionStatus,
            lastUpdateTime: this.lastUpdateTime,
            autoRefreshEnabled: !!this.refreshInterval,
            dataStatus: {
                hasWorkflowData: !!(this.data.processedWorkflows && this.data.processedWorkflows.length > 0),
                hasIntelligenceData: !!(this.data.processedIntelligence && this.data.processedIntelligence.length > 0),
                hasQualityData: !!(this.data.processedQuality && this.data.processedQuality.length > 0)
            },
            chartStatus: dashboardCharts ? dashboardCharts.getChartsStatus() : {},
            apiStats: api ? api.getApiStats() : {},
            settings: this.settings
        };
    }
    
    // 导出数据
    exportData(format = 'json') {
        const exportData = {
            metadata: {
                exportTime: new Date().toISOString(),
                version: '1.0.0',
                format: format
            },
            systemStatus: this.getSystemStatus(),
            data: this.data
        };
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tech-intelligence-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            Utils.showToast('数据导出完成', 'success');
        }
    }
    
    // 销毁应用
    destroy() {
        this.stopAutoRefresh();
        
        if (dashboardCharts) {
            dashboardCharts.destroyAllCharts();
        }
        
        if (api) {
            api.reset();
        }
        
        Utils.clearCache();
        this.isInitialized = false;
        
        console.log('技术洞察仪表板已销毁');
    }
}

// 创建应用实例
const app = new TechIntelligenceApp();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加加载动画
    document.body.classList.add('loading');
    
    app.init().finally(() => {
        document.body.classList.remove('loading');
    });
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    app.destroy();
});

// 全局快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + E 导出数据
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        app.exportData();
    }
    
    // F5 刷新数据
    if (e.key === 'F5') {
        e.preventDefault();
        app.refreshData();
    }
});

// 导出应用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TechIntelligenceApp, app };
} else if (typeof window !== 'undefined') {
    window.TechIntelligenceApp = TechIntelligenceApp;
    window.app = app;
}
