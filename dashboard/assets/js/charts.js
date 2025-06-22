// 图表配置和渲染增强版

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.colors = CONFIG.CHARTS.COLORS;
        this.defaultOptions = {
            responsive: CONFIG.CHARTS.RESPONSIVE,
            maintainAspectRatio: CONFIG.CHARTS.MAINTAIN_ASPECT_RATIO,
            animation: {
                duration: CONFIG.CHARTS.ANIMATION.DURATION,
                easing: CONFIG.CHARTS.ANIMATION.EASING
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: true
                }
            }
        };
    }
    
    // 初始化所有图表
    initCharts() {
        try {
            this.initTimelineChart();
            this.initFunnelChart();
            this.initScatterChart();
            console.log('所有图表初始化完成');
        } catch (error) {
            console.error('图表初始化失败:', error);
            Utils.showError('图表初始化失败', error);
        }
    }
    
    // 初始化时间线图表
    initTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) {
            console.warn('timelineChart 元素不存在');
            return;
        }
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '平均执行时长',
                    data: [],
                    borderColor: this.colors.PRIMARY,
                    backgroundColor: this.colors.PRIMARY + '20',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.colors.PRIMARY,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: '成功率',
                    data: [],
                    borderColor: this.colors.SUCCESS,
                    backgroundColor: this.colors.SUCCESS + '20',
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: this.colors.SUCCESS,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y1'
                }]
            },
            options: {
                ...this.defaultOptions,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '时间'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '执行时长 (分钟)'
                        },
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '成功率 (%)'
                        },
                        min: 0,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: '工作流执行趋势',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }
    
    // 初始化漏斗图表
    initFunnelChart() {
        const ctx = document.getElementById('funnelChart');
        if (!ctx) {
            console.warn('funnelChart 元素不存在');
            return;
        }
        
        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['原始数据采集', '信号识别', '证据验证', '深度分析', '决策建议'],
                datasets: [{
                    label: '数据量',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        this.colors.SECONDARY + '80',
                        this.colors.PRIMARY + '80',
                        this.colors.WARNING + '80',
                        this.colors.SUCCESS + '80',
                        this.colors.DANGER + '80'
                    ],
                    borderColor: [
                        this.colors.SECONDARY,
                        this.colors.PRIMARY,
                        this.colors.WARNING,
                        this.colors.SUCCESS,
                        this.colors.DANGER
                    ],
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '数据量'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: '数据处理流转漏斗',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                const total = Math.max(...context.dataset.data);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${context.dataset.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // 初始化散点图
    initScatterChart() {
        const ctx = document.getElementById('scatterChart');
        if (!ctx) {
            console.warn('scatterChart 元素不存在');
            return;
        }
        
        this.charts.scatter = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '学术论文',
                    data: [],
                    backgroundColor: this.colors.PRIMARY + '80',
                    borderColor: this.colors.PRIMARY,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: '专利数据',
                    data: [],
                    backgroundColor: this.colors.SUCCESS + '80',
                    borderColor: this.colors.SUCCESS,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: '技术新闻',
                    data: [],
                    backgroundColor: this.colors.WARNING + '80',
                    borderColor: this.colors.WARNING,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: '其他来源',
                    data: [],
                    backgroundColor: this.colors.INFO + '80',
                    borderColor: this.colors.INFO,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: '商业价值评分'
                        },
                        min: 0,
                        max: 10,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '技术突破性评分'
                        },
                        min: 0,
                        max: 10,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: true,
                        text: '洞察价值分布矩阵',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            title: function(context) {
                                return '洞察详情';
                            },
                            label: function(context) {
                                const point = context.parsed;
                                return [
                                    `数据类型: ${context.dataset.label}`,
                                    `商业价值: ${point.x.toFixed(1)}`,
                                    `技术突破性: ${point.y.toFixed(1)}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }
    
    // 更新时间线图表
    updateTimelineChart(data) {
        if (!this.charts.timeline) {
            console.warn('时间线图表未初始化');
            return;
        }
        
        try {
            this.charts.timeline.data.labels = data.labels || [];
            this.charts.timeline.data.datasets[0].data = data.durations || [];
            this.charts.timeline.data.datasets[1].data = data.successRates || [];
            
            if (CONFIG.CHARTS.ANIMATION.ENABLED) {
                this.charts.timeline.update('active');
            } else {
                this.charts.timeline.update('none');
            }
        } catch (error) {
            console.error('更新时间线图表失败:', error);
        }
    }
    
    // 更新漏斗图表
    updateFunnelChart(data) {
        if (!this.charts.funnel) {
            console.warn('漏斗图表未初始化');
            return;
        }
        
        try {
            this.charts.funnel.data.datasets[0].data = data || [0, 0, 0, 0, 0];
            
            if (CONFIG.CHARTS.ANIMATION.ENABLED) {
                this.charts.funnel.update('active');
            } else {
                this.charts.funnel.update('none');
            }
        } catch (error) {
            console.error('更新漏斗图表失败:', error);
        }
    }
    
    // 更新散点图
    updateScatterChart(data) {
        if (!this.charts.scatter) {
            console.warn('散点图表未初始化');
            return;
        }
        
        try {
            // 按数据类型分组
            const groupedData = this.groupScatterData(data);
            
            this.charts.scatter.data.datasets[0].data = groupedData.academic_papers || [];
            this.charts.scatter.data.datasets[1].data = groupedData.patent_data || [];
            this.charts.scatter.data.datasets[2].data = groupedData.tech_news || [];
            this.charts.scatter.data.datasets[3].data = groupedData.others || [];
            
            if (CONFIG.CHARTS.ANIMATION.ENABLED) {
                this.charts.scatter.update('active');
            } else {
                this.charts.scatter.update('none');
            }
        } catch (error) {
            console.error('更新散点图失败:', error);
        }
    }
    
    // 分组散点图数据
    groupScatterData(data) {
        const grouped = {
            academic_papers: [],
            patent_data: [],
            tech_news: [],
            others: []
        };
        
        if (!Array.isArray(data)) return grouped;
        
        data.forEach(item => {
            const point = {
                x: item.commercialValue || 0,
                y: item.technicalBreakthrough || 0,
                title: item.title || '',
                id: item.id || ''
            };
            
            switch (item.dataType) {
                case 'academic_papers':
                    grouped.academic_papers.push(point);
                    break;
                case 'patent_data':
                    grouped.patent_data.push(point);
                    break;
                case 'tech_news':
                    grouped.tech_news.push(point);
                    break;
                default:
                    grouped.others.push(point);
            }
        });
        
        return grouped;
    }
    
    // 创建迷你图表
    createMiniChart(canvasId, type, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const defaultMiniOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                point: { radius: 0 },
                line: { borderWidth: 2 }
            },
            animation: { duration: 0 }
        };
        
        const chartOptions = { ...defaultMiniOptions, ...options };
        
        return new Chart(ctx, {
            type: type,
            data: data,
            options: chartOptions
        });
    }
    
    // 获取图表截图
    getChartImage(chartName, format = 'png') {
        const chart = this.charts[chartName];
        if (!chart) return null;
        
        try {
            return chart.toBase64Image(format, 1.0);
        } catch (error) {
            console.error(`获取图表截图失败 (${chartName}):`, error);
            return null;
        }
    }
    
    // 导出所有图表
    exportAllCharts() {
        const exports = {};
        
        Object.keys(this.charts).forEach(name => {
            const image = this.getChartImage(name);
            if (image) {
                exports[name] = image;
            }
        });
        
        return exports;
    }
    
    // 重置图表大小
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
    
    // 切换动画
    toggleAnimation(enabled) {
        CONFIG.CHARTS.ANIMATION.ENABLED = enabled;
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options && chart.options.animation) {
                chart.options.animation.duration = enabled ? CONFIG.CHARTS.ANIMATION.DURATION : 0;
            }
        });
    }
    
    // 销毁指定图表
    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            delete this.charts[chartName];
        }
    }
    
    // 销毁所有图表
    destroyAllCharts() {
        Object.keys(this.charts).forEach(name => {
            this.destroyChart(name);
        });
        this.charts = {};
    }
    
    // 获取图表状态
    getChartsStatus() {
        const status = {};
        
        Object.keys(this.charts).forEach(name => {
            const chart = this.charts[name];
            status[name] = {
                initialized: !!chart,
                hasData: chart && chart.data && chart.data.datasets && chart.data.datasets.length > 0,
                dataPoints: chart ? this.getDataPointsCount(chart) : 0
            };
        });
        
        return status;
    }
    
    // 获取数据点数量
    getDataPointsCount(chart) {
        if (!chart || !chart.data || !chart.data.datasets) return 0;
        
        return chart.data.datasets.reduce((total, dataset) => {
            return total + (dataset.data ? dataset.data.length : 0);
        }, 0);
    }
}

// 创建图表实例
const dashboardCharts = new DashboardCharts();

// 窗口大小变化时重置图表大小
window.addEventListener('resize', Utils.debounce(() => {
    dashboardCharts.resizeCharts();
}, 250));

// 导出图表类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardCharts, dashboardCharts };
} else if (typeof window !== 'undefined') {
    window.DashboardCharts = DashboardCharts;
    window.dashboardCharts = dashboardCharts;
}
