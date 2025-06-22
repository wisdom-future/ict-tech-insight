# 技术情报系统监控仪表板

## 📊 项目概述

这是一个基于Google Sheets数据的技术情报系统监控仪表板，提供实时的系统状态监控、数据流转追踪和业务价值分析。

## 🚀 功能特性

- **实时监控**: 工作流执行状态、系统健康度、数据处理进度
- **数据可视化**: 多种图表展示数据流转和业务价值
- **移动端适配**: 响应式设计，支持手机和平板访问
- **自动刷新**: 定时更新数据，保持信息实时性
- **错误处理**: 完善的错误提示和重试机制

## 📱 访问方式

### 在线访问
```
https://你的用户名.github.io/ict-tech-insight/dashboard/
```

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/你的用户名/ict-tech-insight.git

# 进入dashboard目录
cd ict-tech-insight/dashboard

# 使用本地服务器运行
python -m http.server 8000
# 或者
npx serve .
```

## ⚙️ 配置说明

### 1. Google Sheets API配置

在使用前，需要配置Google Sheets API：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用Google Sheets API
4. 创建API密钥（限制为Sheets API）
5. 配置域名限制（可选）

### 2. 修改配置文件

编辑 `config/config.js` 文件：

```javascript
const CONFIG = {
    GOOGLE_SHEETS: {
        API_KEY: '你的API密钥',
        SPREADSHEET_IDS: {
            CONFIG_DB: '配置数据库表格ID',
            RAWDATA_DB: '原始数据数据库表格ID',
            INTELLIGENCE_DB: '情报数据库表格ID',
            OPERATIONS_DB: '运营数据库表格ID'
        }
    }
};
```

### 3. 表格权限设置

确保所有Google Sheets表格的共享权限设置为：
- "知道链接的任何人都可以查看"
- 或者将API服务账号添加为查看者

## 📊 仪表板功能

### 系统概览
- 系统健康度百分比
- 今日新增情报数量
- 当前告警数量
- 运行中工作流数量

### 工作流监控
- 实时工作流执行状态
- 执行时长趋势图
- 工作流依赖关系

### 数据流转
- 数据处理漏斗图
- 数据质量指标
- 处理效率统计

### 业务价值
- 情报价值分布矩阵
- TOP情报排行榜
- 技术热度分析

## 🔧 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **图表库**: Chart.js
- **数据源**: Google Sheets API v4
- **部署**: GitHub Pages
- **响应式**: CSS Grid + Flexbox

## 📱 移动端特性

- 响应式布局设计
- 触摸友好的交互
- 优化的移动端图表
- 支持添加到主屏幕
- 离线数据缓存

## 🔒 安全考虑

- API密钥仅限只读权限
- 支持域名限制访问
- 不存储敏感数据
- HTTPS加密传输

## 🐛 故障排除

### 常见问题

1. **数据加载失败**
   - 检查API密钥是否正确
   - 确认表格ID是否正确
   - 验证表格权限设置

2. **图表显示异常**
   - 检查数据格式是否正确
   - 确认网络连接正常
   - 清除浏览器缓存

3. **移动端显示问题**
   - 检查viewport设置
   - 确认CSS文件加载正常
   - 测试不同设备和浏览器

## 📈 性能优化

- 数据缓存机制
- 图表懒加载
- 资源压缩优化
- CDN加速

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请通过以下方式联系：
- GitHub Issues
- 邮箱: your-email@example.com

---

**最后更新**: 2024年12月
