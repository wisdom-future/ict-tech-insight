# Make.com 工作流配置

## 📋 工作流概述

本目录包含所有Make.com自动化工作流的配置文件和文档。每个工作流都专注于特定的数据收集和分析任务。

## 🔄 工作流列表

### 数据收集工作流
- **学术研究收集** (`academic-research/`) - 收集和分析学术论文
- **开源生态监控** (`opensource-ecosystem/`) - 跟踪GitHub项目和开源趋势
- **专利情报收集** (`patent-intelligence/`) - 监控专利申请和技术创新
- **新闻情报分析** (`news-intelligence/`) - 收集行业新闻和市场动态
- **竞争对手监控** (`competitor-intelligence/`) - 全方位竞争对手情报

### 分析工作流
- **AI多模型分析** (`ai-analysis/`) - 集成多个AI模型进行深度分析

### 公共组件
- **通用组件** (`common/`) - 错误处理、数据验证、通知模板等

## 📁 目录结构说明

每个工作流目录包含：
- `*-workflow.json` - Make.com工作流配置文件
- `config.json` - 工作流参数配置
- `data-mapping.json` - 数据字段映射
- `README.md` - 工作流详细说明

## 🚀 部署指南

### 1. 导入工作流
```bash
# 使用部署脚本
python scripts/deployment/deploy-workflows.py --workflow academic-research

# 或手动导入到Make.com
```

### 2. 配置参数
```bash
# 编辑配置文件
vim workflows/academic-research/config.json

# 设置API密钥和连接
```

### 3. 测试运行
```bash
# 验证工作流配置
python tools/validators/workflow-validator.py

# 运行测试
python tests/integration-tests/workflow-integration-tests.py
```
