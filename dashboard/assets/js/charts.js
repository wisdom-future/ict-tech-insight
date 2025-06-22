// 图表配置和渲染

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.colors = CONFIG.CHARTS.COLORS;
    }
    
    // 初始化所有图表
    initCharts() {
        this.initTimelineChart();
        this.initFunnelChart();
        this.initScatterChart();
    }
    
    // 初始化时间线图表
    initTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '工作流执行时长',
                    data: [],
                    borderColor: this.colors.PRIMARY,
                    backgroundColor: this.colors.PRIMARY + '20',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '工作流执行时长趋势'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '执行时长 (分钟)'
                        }
                    }
                }
            }
        });
    }
    
    // 初始化漏斗图表
    initFunnelChart() {
        const ctx = document.getElementById('funnelChart');
        if (!ctx) return;
        
        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['原始数据', '信号识别', '证据验证', '深度分析', '决策建议'],
                datasets: [{
                    label: '数据量',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        this.colors.SECONDARY,
                        this.colors.PRIMARY,
                        this.colors.WARNING,
                        this.colors.SUCCESS,
                        this.colors.DANGER
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '数据流转漏斗'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // 初始化散点图
    initScatterChart() {
        const ctx = document.getElementById('scatterChart');
        if (!ctx) return;
        
        this.charts.scatter = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '情报价值分布',
                    data: [],
                    backgroundColor: this.colors.PRIMARY + '80',
                    borderColor: this.colors.PRIMARY,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '情报价值矩阵'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '商业价值评分'
                        },
                        min: 0,
                        max: 10
                    },
                    y: {
                        title: {
                            display: true,
                            text: '技术突破性评分'
                        },
                        min: 0,
                        max: 10
                    }
                }
            }
        });
    }
    
    // 更新时间线图表
    updateTimelineChart(data) {
        if (!this.charts.timeline) return;
        
        this.charts.timeline.data.labels = data.labels;
        this.charts.timeline.data.datasets[0].data = data.values;
        this.charts.timeline.update();
    }
    
    // 更新漏斗图表
    updateFunnelChart(data) {
        if (!this.charts.funnel) return;
        
        this.charts.funnel.data.datasets[0].data = data;
        this.charts.funnel.update();
    }
    
    // 更新散点图
    updateScatterChart(data) {
        if (!this.charts.scatter) return;
        
        this.charts.scatter.data.datasets[0].data = data;
        this.charts.scatter.update();
    }
    
    // 销毁所有图表
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// 创建图表实例
const dashboardCharts = new DashboardCharts();

// 导出图表类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardCharts, dashboardCharts };
} else if (typeof window !== 'undefined') {
    window.DashboardCharts = DashboardCharts;
    window.dashboardCharts = dashboardCharts;
}
