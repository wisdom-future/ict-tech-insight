const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🔍 检查配置文件...');

// 检查配置文件是否存在
const configFiles = [
  'ict-tech-insight-generator.yml',
  'ict-tech-insight-generator.yaml',
  'generator.yml'
];

let configFile = null;
for (const file of configFiles) {
  if (fs.existsSync(file)) {
    configFile = file;
    console.log(`✅ 找到配置文件: ${file}`);
    break;
  }
}

if (!configFile) {
  console.log('❌ 未找到配置文件，列出当前目录：');
  console.log(fs.readdirSync('.'));
  process.exit(1);
}

try {
  const configContent = fs.readFileSync(configFile, 'utf8');
  console.log('📄 配置文件大小:', configContent.length, '字符');
  
  const config = yaml.load(configContent);
  console.log('✅ YAML 解析成功');
  
  if (!config.structure || !config.structure.directories) {
    console.log('❌ 配置文件格式错误，缺少 structure.directories');
    process.exit(1);
  }
  
  // 创建目录
  console.log('🏗️  开始创建目录...');
  config.structure.directories.forEach(dir => {
    if (!dir.includes('.github/workflows')) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ 创建目录: ${dir}`);
      } else {
        console.log(`⏭️  目录已存在: ${dir}`);
      }
    }
  });

  // 创建文件
  console.log('📄 开始创建文件...');
  let fileCount = 0;
  Object.entries(config.files || {}).forEach(([filePath, content]) => {
    if (!filePath.includes('.github/workflows/')) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content.trim());
      console.log(`✅ 创建文件: ${filePath}`);
      fileCount++;
    }
  });

  console.log(`🎉 完成！创建了 ${fileCount} 个文件`);
} catch (error) {
  console.error('❌ 错误:', error.message);
  console.error('❌ 堆栈:', error.stack);
  process.exit(1);
}
