#!/bin/bash
# ICT Tech Insight 快速部署脚本

echo "🚀 开始部署 ICT Tech Insight..."

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录执行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败"
    exit 1
fi

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📊 构建统计："
    du -sh dist/
    echo "📁 构建文件："
    ls -la dist/
else
    echo "❌ 构建目录不存在"
    exit 1
fi

# Git 操作
echo "📤 提交到GitHub..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️  没有新的更改需要提交"
git push origin main

if [ $? -eq 0 ]; then
    echo "🎉 部署完成！"
    echo "🌐 访问地址: https://yourusername.github.io/ict-tech-insight/"
    echo "⏱️  GitHub Pages 可能需要几分钟时间更新"
    echo ""
    echo "📋 后续步骤："
    echo "1. 在 GitHub 仓库设置中启用 GitHub Pages"
    echo "2. 配置 Make.com webhook URL 到 GitHub Secrets"
    echo "3. 测试数据更新流程"
else
    echo "❌ Git 推送失败，请检查网络连接和权限"
    exit 1
fi