// 简化版图表组件 - 避免Chart.js依赖错误
class DashboardCharts {
    constructor() {
        this.charts = {};
        console.log('图表组件初始化（简化模式）');
    }

    // 初始化所有图表
    initCharts() {
        console.log('图表初始化（简化模式）- 跳过Chart.js依赖');
        return Promise.resolve();
    }

    // 更新时间线图表
    updateTimelineChart(data) {
        console.log('时间线图表更新（简化模式）:', data);
    }

    // 更新漏斗图表
    updateFunnelChart(data) {
        console.log('漏斗图表更新（简化模式）:', data);
    }

    // 更新散点图
    updateScatterChart(data) {
        console.log('散点图表更新（简化模式）:', data);
    }

    // 获取图表状态
    getChartsStatus() {
        return {
            simplified: true,
            chartsEnabled: false,
            message: '图表功能已简化，使用文本和进度条显示'
        };
    }

    // 切换动画（简化版）
    toggleAnimation(enabled) {
        console.log('图表动画切换（简化模式）:', enabled);
    }

    // 销毁所有图表
    destroyAllCharts() {
        console.log('图表清理完成（简化模式）');
        this.charts = {};
    }

    // 重置图表大小
    resizeCharts() {
        console.log('图表大小重置（简化模式）');
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
