// 简化版主应用逻辑

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
    }

    // 设置错误处理
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('全局错误:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('未处理的Promise拒绝:', e.reason);
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

            // 跳过图表初始化
            Utils.showLoading('初始化界面组件...');
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
        
        // 新增：更新页面静态数据
        this.updatePageData();
    } catch (error) {
        console.error('UI更新失败:', error);
    }
}

// 新增方法：更新页面数据
updatePageData() {
    try {
        // 更新核心指标
        const metrics = this.calculateMetrics();
        
        // 更新业务产出率
        const businessOutputEl = document.getElementById('businessOutput');
        if (businessOutputEl) {
            businessOutputEl.textContent = `${metrics.systemHealth.toFixed(1)}%`;
        }
        
        // 更新处理效率
        const processingEfficiencyEl = document.getElementById('processingEfficiency');
        if (processingEfficiencyEl) {
            const efficiency = this.calculateProcessingEfficiency();
            processingEfficiencyEl.textContent = `${efficiency.toFixed(1)}%`;
        }
        
        // 更新洞察质量
        const insightQualityEl = document.getElementById('insightQuality');
        if (insightQualityEl) {
            const avgQuality = this.calculateAverageQuality();
            insightQualityEl.textContent = `${avgQuality.toFixed(1)}/10`;
        }
        
        // 更新业务流程数据
        this.updateProcessFlowData();
        
        // 更新TOP洞察列表（使用真实数据）
        const intelligenceData = this.data.processedIntelligence || [];
        this.updateTopInsightsList(intelligenceData);
        
        // 更新技术突破列表
        this.updateBreakthroughList(intelligenceData);
        
        // 更新趋势数据
        this.updateTrendData();
        
    } catch (error) {
        console.error('页面数据更新失败:', error);
    }
}

// 计算处理效率
calculateProcessingEfficiency() {
    const rawDataStats = this.data.rawData || {};
    const intelligenceData = this.data.processedIntelligence || [];
    
    let totalRawData = 0;
    Object.values(rawDataStats).forEach(sheetData => {
        if (Array.isArray(sheetData)) {
            totalRawData += Math.max(0, sheetData.length - 1);
        }
    });
    
    const processedData = intelligenceData.length;
    return totalRawData > 0 ? (processedData / totalRawData) * 100 : 0;
}

// 计算平均质量
calculateAverageQuality() {
    const intelligenceData = this.data.processedIntelligence || [];
    if (intelligenceData.length === 0) return 0;
    
    const totalScore = intelligenceData.reduce((sum, item) => {
        return sum + (item.signalStrength || 0);
    }, 0);
    
    return totalScore / intelligenceData.length;
}

// 更新流程数据
updateProcessFlowData() {
    const rawDataStats = this.data.rawData || {};
    const intelligenceData = this.data.processedIntelligence || [];
    
    // 数据采集
    let totalRawData = 0;
    Object.values(rawDataStats).forEach(sheetData => {
        if (Array.isArray(sheetData)) {
            totalRawData += Math.max(0, sheetData.length - 1);
        }
    });
    
    const dataCollectionEl = document.getElementById('dataCollection');
    if (dataCollectionEl) {
        dataCollectionEl.textContent = `${totalRawData}条`;
    }
    
    // AI分析进度
    const aiAnalysisEl = document.getElementById('aiAnalysis');
    if (aiAnalysisEl) {
        const processingRate = this.calculateProcessingEfficiency();
        aiAnalysisEl.textContent = `处理中${processingRate.toFixed(0)}%`;
    }
    
    // 洞察提取
    const insightExtractionEl = document.getElementById('insightExtraction');
    if (insightExtractionEl) {
        const today = new Date().toISOString().split('T')[0];
        const todayInsights = intelligenceData.filter(item => 
            item.createdTimestamp && item.createdTimestamp.startsWith(today)
        ).length;
        insightExtractionEl.textContent = `新增${todayInsights}条`;
    }
    
    // 价值评估
    const valueAssessmentEl = document.getElementById('valueAssessment');
    if (valueAssessmentEl) {
        const highValueCount = intelligenceData.filter(item => 
            item.commercialValueScore >= 8.0
        ).length;
        valueAssessmentEl.textContent = `${highValueCount}个高价值`;
    }
    
    // 行动建议
    const actionRecommendationsEl = document.getElementById('actionRecommendations');
    if (actionRecommendationsEl) {
        const recommendations = Math.floor(intelligenceData.length * 0.3);
        actionRecommendationsEl.textContent = `待执行${recommendations}项`;
    }
    
    // 流程统计
    const flowEfficiencyEl = document.getElementById('flowEfficiency');
    if (flowEfficiencyEl) {
        flowEfficiencyEl.textContent = `${this.calculateProcessingEfficiency().toFixed(0)}%`;
    }
    
    const avgProcessTimeEl = document.getElementById('avgProcessTime');
    if (avgProcessTimeEl) {
        avgProcessTimeEl.textContent = '3.2分钟'; // 可以后续从工作流数据计算
    }
    
    const todayCompletedEl = document.getElementById('todayCompleted');
    if (todayCompletedEl) {
        todayCompletedEl.textContent = `${intelligenceData.length}条`;
    }
}

// 更新TOP洞察列表
updateTopInsightsList(intelligenceData) {
    const intelligenceListEl = document.getElementById('topInsightsList');
    if (!intelligenceListEl) return;

    const topIntel = intelligenceData
        .filter(intel => intel.signalStrength > 0)
        .sort((a, b) => (b.signalStrength || 0) - (a.signalStrength || 0))
        .slice(0, 3);

    let html = '';
    if (topIntel.length === 0) {
        html = '<div class="loading">正在加载洞察数据...</div>';
    } else {
        topIntel.forEach((intel, index) => {
            const hasLink = intel.sourceUrl && intel.sourceUrl !== '' && intel.sourceUrl !== '--';
            const title = intel.title || '无标题';
            const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
            
            html += `
                <div class="insight-item" onclick="handleInsightClick('${intel.intelligenceId}', '${intel.sourceUrl || ''}')">
                    <div class="insight-rank">#${index + 1}</div>
                    <div class="insight-content">
                        <div class="insight-title">${this.getInsightIcon(intel.dataType)} ${shortTitle}</div>
                        <div class="insight-scores">
                            <span>信号强度: <strong>${(intel.signalStrength || 0).toFixed(1)}</strong></span>
                            <span>商业价值: <strong>${(intel.commercialValueScore || 0).toFixed(1)}</strong></span>
                        </div>
                        <div class="insight-action">
                            ${hasLink ? '点击查看原文' : '点击查看详情'}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    intelligenceListEl.innerHTML = html;
    
    // 更新统计数据
    const todayInsightsEl = document.getElementById('todayInsights');
    if (todayInsightsEl) {
        todayInsightsEl.textContent = `${intelligenceData.length}条`;
    }
    
    const highValueCountEl = document.getElementById('highValueCount');
    if (highValueCountEl) {
        const highValueCount = intelligenceData.filter(item => 
            item.commercialValueScore >= 8.0
        ).length;
        highValueCountEl.textContent = `${highValueCount}条`;
    }
}

// 获取洞察图标
getInsightIcon(dataType) {
    const icons = {
        'academic_papers': '📄',
        'patent_data': '📋',
        'tech_news': '📰',
        'opensource_data': '💻',
        'industry_dynamics': '🏭',
        'competitor_intelligence': '🔍'
    };
    return icons[dataType] || '🔥';
}

// 更新技术突破列表
updateBreakthroughList(intelligenceData) {
    const breakthroughListEl = document.getElementById('breakthroughList');
    if (!breakthroughListEl) return;

    const breakthroughs = intelligenceData
        .filter(intel => intel.breakthroughScore >= 8.0)
        .sort((a, b) => (b.breakthroughScore || 0) - (a.breakthroughScore || 0))
        .slice(0, 3);

    let html = '';
    if (breakthroughs.length === 0) {
        html = '<div class="loading">暂无突破性技术发现</div>';
    } else {
        breakthroughs.forEach(breakthrough => {
            const hasLink = breakthrough.sourceUrl && breakthrough.sourceUrl !== '' && breakthrough.sourceUrl !== '--';
            const title = breakthrough.title || breakthrough.techKeyword || '技术突破';
            const shortTitle = title.length > 15 ? title.substring(0, 15) + '...' : title;
            const timeAgo = this.getTimeAgo(breakthrough.createdTimestamp);
            
            html += `
                <div class="breakthrough-item" onclick="${hasLink ? `openSourceLink('${breakthrough.sourceUrl}')` : `handleInsightClick('${breakthrough.intelligenceId}', '')`}">
                    <div class="breakthrough-content">
                        <div class="breakthrough-title">• ${shortTitle}</div>
                        <div class="breakthrough-score">(${(breakthrough.breakthroughScore || 0).toFixed(1)}分)</div>
                    </div>
                    <div class="breakthrough-time">[${timeAgo}]</div>
                </div>
            `;
        });
    }

    breakthroughListEl.innerHTML = html;
}

// 计算时间差
getTimeAgo(timestamp) {
    if (!timestamp) return '未知时间';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 24) {
        return `${Math.floor(diffHours / 24)}天前`;
    } else if (diffHours > 0) {
        return `${diffHours}小时前`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes}分钟前`;
    } else {
        return '刚刚';
    }
}

// 更新趋势数据
updateTrendData() {
    const intelligenceData = this.data.processedIntelligence || [];
    
    // 按数据类型统计
    const typeStats = {};
    intelligenceData.forEach(intel => {
        const type = intel.dataType || 'unknown';
        if (!typeStats[type]) {
            typeStats[type] = { count: 0, trend: 0 };
        }
        typeStats[type].count++;
    });
    
    // 更新热门技术领域（这里先用模拟数据，后续可以改进）
    const trendItems = document.querySelectorAll('.trend-item .trend-value');
    if (trendItems.length >= 4) {
        trendItems[0].textContent = `${typeStats.academic_papers?.count || 0}条洞察 (↗️ +15%)`;
        trendItems[1].textContent = `${typeStats.patent_data?.count || 0}条洞察 (↗️ +28%)`;
        trendItems[2].textContent = `${typeStats.tech_news?.count || 0}条洞察 (↗️ +8%)`;
        trendItems[3].textContent = `${typeStats.industry_dynamics?.count || 0}条洞察 (↘️ -5%)`;
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
        this.updateMetricCard('todayInsights', {
            value: Utils.formatNumber(metrics.todayIntelligence),
            trend: this.calculateTrend('todayInsights', metrics.todayIntelligence),
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
        const valueEl = document.getElementById(cardId);
        const trendEl = document.getElementById(cardId.replace('Count', 'Trend').replace('Health', 'Trend').replace('Insights', 'Trend').replace('Workflows', 'Trend'));
        const iconEl = document.getElementById(cardId.replace('systemHealth', 'healthIcon'));

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

        // 健康度进度条
        if (cardId === 'systemHealth') {
            const progressBar = document.getElementById('healthProgressBar');
            if (progressBar) {
                const percentage = parseFloat(data.value);
                progressBar.style.width = `${percentage}%`;
            }
        }
    }

    // 计算趋势
    calculateTrend(metric, currentValue) {
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
        const systemHealth = totalWorkflows > 0 ? (successfulWorkflows / totalWorkflows) * 100 : 95;

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

        if (latestStatuses.length === 0) {
            html = '<div class="loading">暂无工作流数据</div>';
        } else {
            latestStatuses.forEach(status => {
                const statusColor = this.getStatusColor(status.executionStatus);
                const statusIcon = this.getStatusIcon(status.executionStatus);
                const statusText = this.getStatusText(status.executionStatus);

                html += `
                    <div class="workflow-card">
                        <div class="workflow-header">
                            <div class="workflow-name">${status.workflowName}</div>
                            <div class="workflow-status" style="color: ${statusColor}">
                                ${statusIcon} ${statusText}
                            </div>
                        </div>
                        <div class="workflow-meta">
                            <div class="workflow-time">
                                ${this.formatDateTime(status.startTimestamp, 'short')}
                            </div>
                            <div class="workflow-duration">
                                耗时: ${status.durationSeconds ? Math.round(status.durationSeconds / 60) : '--'}分钟
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        workflowListEl.innerHTML = html;
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

    // 获取状态颜色
    getStatusColor(status) {
        return Utils.getStatusColor(status);
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

    // 格式化时间
    formatDateTime(dateString, format = 'default') {
        return Utils.formatDateTime(dateString, format);
    }

    // 更新数据流转
    updateDataFlow() {
        const rawDataStats = this.data.rawData || {};
        const intelligenceData = this.data.processedIntelligence || [];

        // 计算数据流转统计
        const flowStats = this.calculateDataFlowStats(rawDataStats, intelligenceData);

        // 更新流转统计
        this.updateFlowStats(flowStats);

        // 更新数据流转步骤
        this.updateFlowSteps(flowStats);
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
            const efficiency = stats.rawData > 0 ? ((stats.signalIdentified / stats.rawData) * 100).toFixed(1) : 0;
            processingEfficiency.textContent = `${efficiency}%`;
        }

        if (conversionRate) {
            const conversion = stats.signalIdentified > 0 ? ((stats.actionRecommendations / stats.signalIdentified) * 100).toFixed(1) : 0;
            conversionRate.textContent = `${conversion}%`;
        }

        if (totalInput) {
            totalInput.textContent = Utils.formatNumber(stats.rawData);
        }

        if (totalOutput) {
            totalOutput.textContent = Utils.formatNumber(stats.actionRecommendations);
        }
    }

    // 更新流转步骤
    updateFlowSteps(stats) {
        const steps = [
            { id: 'rawDataCount', value: stats.rawData },
            { id: 'intelligenceCount', value: stats.signalIdentified },
            { id: 'cluesCount', value: stats.evidenceVerified },
            { id: 'actionsCount', value: stats.actionRecommendations }
        ];

        steps.forEach(step => {
            const element = document.getElementById(step.id);
            if (element) {
                element.textContent = Utils.formatNumber(step.value);
            }
        });
    }

    // 更新业务价值
    updateBusinessValue() {
        const intelligenceData = this.data.processedIntelligence || [];

        // 更新价值统计
        this.updateValueSummary(intelligenceData);

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

        // 更新趋势统计
        const trendsStats = this.calculateTrendsStats(intelligenceData);
        this.updateTrendsStats(trendsStats);
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

    // 获取质量颜色
    getQualityColor(score) {
        const thresholds = CONFIG.THRESHOLDS.DATA_QUALITY;

        if (score >= thresholds.EXCELLENT) return CONFIG.CHARTS.COLORS.SUCCESS;
        if (score >= thresholds.GOOD) return CONFIG.CHARTS.COLORS.SUCCESS_LIGHT;
        if (score >= thresholds.ACCEPTABLE) return CONFIG.CHARTS.COLORS.WARNING;
        return CONFIG.CHARTS.COLORS.DANGER;
    }

    // 更新系统状态
    updateSystemStatus(status, message) {
        const statusIndicator = document.getElementById('systemStatus');
        if (statusIndicator) {
            const indicators = {
                'healthy': '🟢 系统状态：运行正常',
                'warning': '🟡 系统状态：警告',
                'error': '🔴 系统状态：错误',
                'unknown': '⚪ 系统状态：未知'
            };
            statusIndicator.textContent = indicators[status] || '⚪ 系统状态：未知';
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

        // 更新数据条数
        const dataCountEl = document.getElementById('dataCount');
        if (dataCountEl) {
            const totalData = this.data.processedIntelligence ? this.data.processedIntelligence.length : 0;
            dataCountEl.textContent = totalData;
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
            chartAnimation: true,
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

// 在 app.js 文件末尾添加以下代码

// 全局交互函数 - 简化版
window.showBusinessOutput = function() {
    Utils.showToast('业务产出详情功能开发中', 'info');
};

window.showProcessingDetails = function() {
    Utils.showToast('处理效率详情功能开发中', 'info');
};

window.showQualityRanking = function() {
    Utils.showToast('洞察质量排行功能开发中', 'info');
};

window.showSystemLogs = function() {
    Utils.showToast('系统日志功能开发中', 'info');
};

// 业务流程点击 - 显示对应数据
window.showDataCollection = function() {
    const rawData = app.data.rawData || {};
    let message = '数据采集详情:\n';
    Object.keys(rawData).forEach(key => {
        if (Array.isArray(rawData[key])) {
            message += `${key}: ${rawData[key].length}条\n`;
        }
    });
    alert(message);
};

window.showAIAnalysis = function() {
    Utils.showToast('AI分析详情功能开发中', 'info');
};

window.showInsightExtraction = function() {
    const intelligenceData = app.data.processedIntelligence || [];
    alert(`洞察提取详情:\n当前洞察数量: ${intelligenceData.length}条\n今日新增: ${intelligenceData.filter(item => {
        const today = new Date().toISOString().split('T')[0];
        return item.createdTimestamp && item.createdTimestamp.startsWith(today);
    }).length}条`);
};

window.showValueAssessment = function() {
    const intelligenceData = app.data.processedIntelligence || [];
    const highValue = intelligenceData.filter(intel => intel.commercialValueScore >= 8.0).length;
    alert(`价值评估详情:\n高价值洞察: ${highValue}条\n平均商业价值分: ${(intelligenceData.reduce((sum, item) => sum + (item.commercialValueScore || 0), 0) / intelligenceData.length).toFixed(1)}`);
};

window.showActionRecommendations = function() {
    Utils.showToast('行动建议功能开发中', 'info');
};

// 价值洞察点击 - 使用真实数据和链接
window.handleInsightClick = function(insightId, sourceUrl) {
    if (sourceUrl && sourceUrl !== '' && sourceUrl !== '--') {
        // 有外部链接，直接跳转
        window.open(sourceUrl, '_blank');
    } else {
        // 没有外部链接，显示详情
        const intelligenceData = app.data.processedIntelligence || [];
        const insight = intelligenceData.find(item => item.intelligenceId === insightId);
        if (insight) {
            const details = `洞察详情:
标题: ${insight.title || '无标题'}
技术关键词: ${insight.techKeyword || '--'}
数据类型: ${insight.dataType || '--'}
信号强度: ${insight.signalStrength || '--'}
商业价值: ${insight.commercialValueScore || '--'}
突破性评分: ${insight.breakthroughScore || '--'}
置信度: ${insight.confidenceLevel || '--'}
处理状态: ${insight.processingStatus || '--'}
创建时间: ${insight.createdTimestamp || '--'}`;
            alert(details);
        } else {
            Utils.showToast('洞察详情功能开发中', 'info');
        }
    }
};

window.showFullRanking = function() {
    const intelligenceData = app.data.processedIntelligence || [];
    let ranking = '完整洞察排行:\n\n';
    intelligenceData
        .sort((a, b) => (b.signalStrength || 0) - (a.signalStrength || 0))
        .slice(0, 10)
        .forEach((item, index) => {
            ranking += `#${index + 1} ${item.title || '无标题'} (${item.signalStrength || 0}分)\n`;
        });
    alert(ranking);
};

// 技术突破点击 - 使用真实链接
window.openSourceLink = function(url) {
    if (url && url !== '' && url !== '--') {
        window.open(url, '_blank');
    } else {
        Utils.showToast('暂无原文链接', 'warning');
    }
};

window.showTechRadar = function() {
    Utils.showToast('技术雷达图功能开发中', 'info');
};

// 趋势分析点击
window.showDataSourceDetails = function() {
    const rawData = app.data.rawData || {};
    let details = '数据源详情:\n\n';
    Object.entries(rawData).forEach(([key, data]) => {
        if (Array.isArray(data)) {
            details += `${key}: ${data.length}条记录\n`;
        }
    });
    alert(details);
};

window.showDetailedTrendAnalysis = function() {
    Utils.showToast('详细趋势分析功能开发中', 'info');
};

window.setMonitoringRules = function() {
    Utils.showToast('监控规则设置功能开发中', 'info');
};

// 监控详情点击
window.showExecutionLogs = function() {
    const workflowData = app.data.processedWorkflows || [];
    let logs = '执行日志:\n\n';
    workflowData.slice(0, 5).forEach(log => {
        logs += `${log.workflowName}: ${log.executionStatus} (${log.startTimestamp})\n`;
    });
    alert(logs);
};

window.showQualityReport = function() {
    const qualityData = app.data.processedQuality || [];
    if (qualityData.length > 0) {
        const latest = qualityData[0];
        const report = `质量报告:
数据源: ${latest.dataSource || '--'}
总记录数: ${latest.totalRecords || '--'}
有效记录数: ${latest.validRecords || '--'}
准确性: ${latest.dataAccuracyPercentage || '--'}%
完整性: ${latest.dataCompletenessPercentage || '--'}%
一致性: ${latest.dataConsistencyPercentage || '--'}%
总体质量分: ${latest.overallQualityScore || '--'}`;
        alert(report);
    } else {
        Utils.showToast('暂无质量报告数据', 'info');
    }
};

window.showAllAlerts = function() {
    Utils.showToast('告警中心功能开发中', 'info');
};

// 修改 updateTopIntelligence 方法以使用真实数据
if (window.app && window.app.updateTopIntelligence) {
    const originalUpdateTopIntelligence = window.app.updateTopIntelligence;
    window.app.updateTopIntelligence = function(intelligenceData) {
        const intelligenceListEl = document.getElementById('topInsightsList');
        if (!intelligenceListEl) return;

        const topIntel = intelligenceData
            .filter(intel => intel.signalStrength > 0)
            .sort((a, b) => (b.signalStrength || 0) - (a.signalStrength || 0))
            .slice(0, 3);

        let html = '';
        if (topIntel.length === 0) {
            html = '<div class="loading">暂无洞察数据</div>';
        } else {
            topIntel.forEach((intel, index) => {
                const hasLink = intel.sourceUrl && intel.sourceUrl !== '' && intel.sourceUrl !== '--';
                html += `
                    <div class="insight-item" onclick="handleInsightClick('${intel.intelligenceId}', '${intel.sourceUrl || ''}')">
                        <div class="insight-rank">#${index + 1}</div>
                        <div class="insight-content">
                            <div class="insight-title">${intel.title || '无标题'}</div>
                            <div class="insight-scores">
                                <span>信号强度: <strong>${(intel.signalStrength || 0).toFixed(1)}</strong></span>
                                <span>商业价值: <strong>${(intel.commercialValueScore || 0).toFixed(1)}</strong></span>
                            </div>
                            <div class="insight-action">
                                ${hasLink ? '点击查看原文' : '点击查看详情'}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        intelligenceListEl.innerHTML = html;
    };
}
