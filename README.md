# ICT Tech Insight - 技术信息决策引擎

## 🎯 项目概述

ICT Tech Insight 是一个基于 GitHub Pages + Google Sheets + Make.com 的技术信息决策引擎，专门用于监控和分析ICT领域的技术发展趋势、竞争动态和投资机会。

## ✨ 核心功能

- 📊 **概览仪表板**: 实时KPI监控和趋势分析
- 📥 **数据采集监控**: 技术数据和业界标杆双重监控
- 🧠 **智能分析中心**: 商业价值、竞争情报、技术深度三维分析
- 🎯 **行动决策中心**: 投资建议和执行跟踪
- 📑 **报告中心**: 日报、周报、月报自动生成
- ⚙️ **系统管理**: 性能监控、配置管理、日志查看

## 🏗️ 技术架构

```
Frontend: Vue.js 3 + Element Plus + Tailwind CSS
Backend: Google Sheets (数据库) + Make.com (自动化工作流)
Deployment: GitHub Pages + GitHub Actions
Charts: ECharts + Vue-ECharts
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/ict-tech-insight.git
cd ict-tech-insight
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

### 4. 构建部署

```bash
npm run build
# 或使用快速部署脚本
./deploy.sh
```

## 📁 项目结构

```
ict-tech-insight/
├── src/                    # 源代码
│   ├── views/             # 页面组件
│   ├── components/        # 通用组件
│   ├── utils/            # 工具函数
│   └── store/            # 状态管理
├── data/                  # 静态JSON数据
├── public/               # 静态资源
└── .github/workflows/    # GitHub Actions
```

## 🔧 配置说明

### GitHub Pages 配置

1. 在仓库设置中启用 GitHub Pages
2. 选择 GitHub Actions 作为部署源
3. 配置自定义域名（可选）

### Make.com 集成

1. 创建 GitHub Personal Access Token
2. 在 GitHub Secrets 中添加 `MAKE_WEBHOOK_URL`
3. 配置 Make.com 工作流 webhook

### Google Sheets 数据库

1. 创建 Google Sheets 数据库
2. 配置 Google Sheets API 访问权限
3. 在 Make.com 中配置 Google Sheets 连接

## 📊 数据流架构

```
Google Sheets → Make.com → GitHub JSON → Vue.js 前端
```

## 🎨 页面功能

### Overview - 概览仪表板
- 核心KPI指标展示
- 技术热度分布
- 最新高价值信息流

### Collection - 数据采集监控
- 技术数据监控（学术论文、专利、开源项目、技术新闻）
- 业界标杆监控（标杆动态、技术创新、产品发布、人才流动）
- 数据质量监控和执行日志

### Analysis - 智能分析中心
- 商业价值分析（TAM/SAM/ROI）
- 竞争情报分析（威胁评估、合作机会）
- 技术深度分析（TRL评估、应用场景）

### Action - 行动决策中心
- 优先级分类的行动建议
- 投资决策支持工具
- 实施进度跟踪

### Reports - 报告中心
- 自动生成日报、周报、月报
- 自定义报告模板
- 多格式导出和订阅

### System - 系统管理
- 性能监控和资源使用统计
- 配置管理和参数调整
- 日志查看和用户管理

## 🔄 自动化工作流

系统包含13个自动化工作流：

- **数据采集层** (WF1-WF6): 并行采集各类数据源
- **信号识别层** (WF7-WF8): 串行处理信号识别和验证
- **深度分析层** (WF9-WF11): 并行执行三维分析
- **决策支撑层** (WF12-WF13): 串行生成决策建议和报告

## 📈 性能优化

- 懒加载和代码分割
- CDN加速和Gzip压缩
- 本地缓存和数据预加载
- 响应式设计和移动端适配

## 🛡️ 安全考虑

- GitHub Token 权限最小化
- API 调用频率限制
- 数据传输加密
- 访问日志记录

## 📝 开发指南

### 添加新页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.js` 添加路由
3. 在 `data/` 目录添加对应JSON数据文件
4. 更新导航菜单

### 添加新图表

1. 在 `src/components/charts/` 创建图表组件
2. 基于 ECharts 封装
3. 支持响应式和主题切换
4. 添加加载状态和错误处理

### 数据格式规范

```json
{
  "lastUpdated": "2025-06-23T10:00:00Z",
  "data": {
    // 具体数据结构
  },
  "metadata": {
    "version": "1.0.0",
    "source": "make-workflow"
  }
}
```

## 🔧 故障排除

### 常见问题

1. **GitHub Pages 部署失败**
   - 检查 GitHub Actions 日志
   - 确认 package.json 配置正确
   - 验证构建命令和输出目录

2. **数据加载失败**
   - 检查 JSON 文件格式
   - 确认文件路径正确
   - 查看浏览器网络请求

3. **Make.com 集成问题**
   - 验证 Webhook URL 配置
   - 检查 API 权限和配额
   - 查看 Make.com 执行日志

## 📊 监控指标

- 页面加载时间 < 3秒
- 数据更新频率: 每日自动更新
- 系统可用性 > 99%
- 用户体验评分 > 4.5/5

## 🔮 未来规划

- [ ] 添加实时数据推送
- [ ] 集成更多数据源
- [ ] 增强AI分析能力
- [ ] 支持多语言界面
- [ ] 移动端APP开发

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: Jason
- 邮箱: your.email@example.com
- 项目地址: https://github.com/yourusername/ict-tech-insight

## 🙏 致谢

感谢以下开源项目和服务：
- Vue.js 生态系统
- Element Plus UI 组件库
- ECharts 数据可视化
- GitHub Pages 免费托管
- Make.com 自动化平台