# 配置文件管理

## ⚙️ 概述

本目录包含ICT TechInsight Platform的所有配置文件，采用分层配置管理策略，支持多环境部署。

## 📁 配置分类

### 环境配置 (`environments/`)
- 开发环境配置
- 测试环境配置  
- 生产环境配置

### API配置 (`apis/`)
- 各种外部API的连接配置
- API密钥和认证信息
- 请求限制和重试策略

### 数据源配置 (`data-sources/`)
- 技术主题定义
- 竞争对手列表
- 数据质量规则

### AI模型配置 (`ai-models/`)
- AI模型参数配置
- Prompt模板管理
- 模型选择策略

### 仪表板配置 (`dashboards/`)
- Looker Studio配置
- 图表和布局设置
- 交互式参数

### 监控配置 (`monitoring/`)
- 告警规则设置
- 性能阈值定义
- 通知配置

### 安全配置 (`security/`)
- 访问控制策略
- 加密配置
- 审计规则
