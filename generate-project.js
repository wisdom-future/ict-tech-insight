#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// 读取配置文件
const configPath = process.argv[2] || './ict-tech-insight-generator.yml';

if (!fs.existsSync(configPath)) {
  console.error('❌ 配置文件不存在:', configPath);
  process.exit(1);
}

console.log('🚀 开始生成 ICT Tech Insight 项目...');

try {
  const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
  
  // 创建目录结构
  console.log('📁 创建目录结构...');
  config.structure.directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`  ✅ 创建目录: ${dir}`);
    }
  });

  // 生成文件
  console.log('📄 生成项目文件...');
  Object.entries(config.files).forEach(([filePath, content]) => {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
    console.log(`  ✅ 生成文件: ${filePath}`);
  });

  // 设置执行权限
  const scriptFiles = ['deploy.sh', 'generate-project.js'];
  scriptFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, '755');
      console.log(`  ✅ 设置执行权限: ${file}`);
    }
  });

  console.log('🎉 项目生成完成！');
  console.log('');
  console.log('📋 下一步操作：');
  console.log('1. cd ict-tech-insight');
  console.log('2. npm install');
  console.log('3. npm run dev');
  console.log('4. 配置 GitHub Pages 和 Make.com 集成');
  console.log('');
  console.log('🌐 本地开发地址: http://localhost:3000');
  console.log('📚 详细文档请查看: README.md');

} catch (error) {
  console.error('❌ 生成项目时出错:', error.message);
  process.exit(1);
}