# **Make节点使用注意事项总结**

基于我们修复过程中发现的问题，以下是使用Make节点的关键注意事项：

## **🔧 通用注意事项**

### **1. 版本号至关重要**
- **错误：** 随意使用版本号或使用过时版本
- **正确：** 必须使用模块的正确版本号
- **示例：** `google-sheets:filterRows` 必须使用 `"version": 2`

### **2. 参数结构必须精确匹配**
- **错误：** 自定义参数结构或遗漏必需参数
- **正确：** 严格按照Make API文档的参数结构
- **关键：** 每个模块都有特定的必需参数，不能省略

### **3. 连接参数不可忽略**
- **错误：** 忽略 `__IMTCONN__` 连接参数
- **正确：** 所有需要外部服务的模块都必须包含连接ID
- **示例：** Google Sheets、HTTP请求等都需要连接配置

### **4. Make不支持自定义扩展**
- **禁止：** 在蓝图中定义 `functions`、`environment`
- **禁止：** 调用自定义JavaScript函数
- **替代：** 使用Make内置函数和模块组合实现复杂逻辑

---

## **📋 具体节点使用注意事项**

### **1. gateway:CustomWebHook**
```json
{
  "module": "gateway:CustomWebHook",
  "version": 1,  // ✅ 固定版本1
  "parameters": {
    "hook": "webhook-name",     // ✅ 必需：webhook名称
    "maxResults": 1             // ✅ 建议：限制结果数量
  }
}
```
**注意事项：**
- ✅ 版本固定为1
- ✅ `hook` 参数是必需的
- ✅ `maxResults` 建议设置以控制流量
- ❌ 不要添加额外的触发条件参数

### **2. google-sheets:filterRows**
```json
{
  "module": "google-sheets:filterRows", 
  "version": 2,  // ✅ 必须使用版本2
  "parameters": {
    "__IMTCONN__": "connection-id",    // ✅ 必需：连接ID
    "spreadsheetId": "实际表格ID",      // ✅ 必需：完整表格ID
    "sheetId": "0"                     // ✅ 必需：工作表ID（不是名称）
  }
}
```
**注意事项：**
- ✅ 版本必须是2，不是1
- ✅ 必须包含 `__IMTCONN__` 连接参数
- ✅ 使用 `sheetId`（数字），不是 `sheetName`
- ❌ 不要在parameters中添加复杂的filter结构
- ✅ 过滤逻辑在后续节点中用 `util:SetVariable2` 实现

### **3. builtin:BasicFeeder**
```json
{
  "module": "builtin:BasicFeeder",
  "version": 1,  // ✅ 固定版本1
  "parameters": {
    "array": "{{source.array}}"  // ✅ 必需：数组数据源
  }
}
```
**注意事项：**
- ✅ 版本固定为1
- ✅ `array` 参数必须指向有效的数组数据
- ✅ 用于遍历数组中的每个元素
- ❌ 不要尝试添加过滤或转换逻辑

### **4. util:SetVariable2**
```json
{
  "module": "util:SetVariable2",
  "version": 1,  // ✅ 固定版本1
  "parameters": {
    "name": "variable_name",           // ✅ 必需：变量名
    "value": "{{expression}}"          // ✅ 必需：变量值表达式
  }
}
```
**注意事项：**
- ✅ 版本固定为1
- ✅ 用于设置单个变量
- ✅ `value` 可以包含复杂的Make表达式
- ✅ 适合条件判断和数据转换
- ❌ 不要在一个节点中设置多个变量（使用 `util:SetVariables`）

### **5. util:SetVariables**
```json
{
  "module": "util:SetVariables",
  "version": 1,  // ✅ 固定版本1
  "parameters": {
    "variables": [               // ✅ 必需：变量数组
      {
        "name": "var1",
        "value": "{{expr1}}"
      },
      {
        "name": "var2", 
        "value": "{{expr2}}"
      }
    ]
  }
}
```
**注意事项：**
- ✅ 版本固定为1
- ✅ 用于同时设置多个变量
- ✅ `variables` 必须是数组格式
- ✅ 每个变量对象必须包含 `name` 和 `value`
- ✅ 适合批量数据处理和转换

### **6. http:ActionSendData**
```json
{
  "module": "http:ActionSendData",
  "version": 3,  // ✅ 必须使用版本3
  "parameters": {
    "handleErrors": false,           // ✅ 必需参数
    "useNewZLibDeCompress": true,    // ✅ 必需参数
    "url": "https://api.example.com", // ✅ 必需：完整URL
    "serializeUrl": false,           // ✅ 必需参数
    "method": "GET",                 // ✅ 必需：HTTP方法
    "timeout": 30                    // ✅ 建议：设置超时
  }
}
```
**注意事项：**
- ✅ 版本必须是3，不是1
- ✅ `handleErrors`、`useNewZLibDeCompress`、`serializeUrl` 是必需参数
- ✅ `headers` 和 `qs` 使用数组格式，不是对象
- ✅ 建议设置 `timeout` 避免长时间等待
- ❌ 不要省略必需的布尔参数

### **7. xai:createACompletion**
```json
{
  "module": "xai:createACompletion",
  "version": 1,  // ✅ 固定版本1
  "parameters": {
    "model": "grok-beta",        // ✅ 必需：模型名称
    "messages": [...],           // ✅ 必需：消息数组
    "max_tokens": 500,           // ✅ 建议：限制token数量
    "temperature": 0.2           // ✅ 建议：控制随机性
  }
}
```
**注意事项：**
- ✅ 版本固定为1
- ✅ `model` 必须是有效的xAI模型名称
- ✅ `messages` 必须包含 `role` 和 `content`
- ✅ 建议设置 `max_tokens` 控制成本
- ✅ `temperature` 建议设置较低值以获得稳定输出

### **8. json:ParseJSON**
```json
{
  "module": "json:ParseJSON",
  "version": 1,  // ✅ 固定版本1
  "parameters": {
    "json": "{{source.json_string}}"  // ✅ 必需：JSON字符串
  }
}
```
**注意事项：**
- ✅ 版本固定为1
- ✅ `json` 参数必须是有效的JSON字符串
- ✅ 解析后的数据可直接在mapper中使用
- ❌ 不要尝试解析非JSON格式的数据
- ✅ 建议在前面添加JSON格式验证

### **9. google-sheets:addRow**
```json
{
  "module": "google-sheets:addRow",
  "version": 2,  // ✅ 必须使用版本2
  "parameters": {
    "__IMTCONN__": "connection-id",    // ✅ 必需：连接ID
    "spreadsheetId": "表格ID",          // ✅ 必需：完整表格ID
    "sheetId": "0",                    // ✅ 必需：工作表ID
    "mode": "append",                  // ✅ 必需：写入模式
    "insertUnformatted": false,        // ✅ 必需：格式化选项
    "valueInputOption": "RAW"          // ✅ 必需：值输入选项
  }
}
```
**注意事项：**
- ✅ 版本必须是2，不是1
- ✅ 必须包含所有必需参数，不能省略
- ✅ `values` 在mapper中定义，不在parameters中
- ✅ 使用 `sheetId`（数字），不是 `sheetName`
- ✅ `mode` 通常使用 "append"
- ✅ `valueInputOption` 建议使用 "RAW"

---

## **🚨 常见错误总结**

### **1. 版本号错误**
```json
// ❌ 错误
{"module": "google-sheets:filterRows", "version": 1}

// ✅ 正确  
{"module": "google-sheets:filterRows", "version": 2}
```

### **2. 缺少连接参数**
```json
// ❌ 错误
{"module": "google-sheets:addRow", "parameters": {"spreadsheetId": "..."}}

// ✅ 正确
{"module": "google-sheets:addRow", "parameters": {"__IMTCONN__": "...", "spreadsheetId": "..."}}
```

### **3. 参数结构错误**
```json
// ❌ 错误
{"qs": {"param": "value"}}

// ✅ 正确
{"qs": [{"name": "param", "value": "value"}]}
```

### **4. 使用不存在的功能**
```json
// ❌ 错误 - Make不支持
{"functions": [...]}
{"environment": {...}}

// ✅ 正确 - 使用内置模块
{"module": "util:SetVariable2"}
```

### **5. 环境变量语法错误**
```json
// ❌ 错误
{"value": "{{env.API_KEY}}"}

// ✅ 正确
{"value": "YOUR_API_KEY_HERE"}
```

---

## **💡 最佳实践建议**

1. **始终查阅官方文档** - 确认模块的正确版本和参数
2. **使用测试环境** - 先在测试场景中验证节点配置
3. **逐步构建** - 一个节点一个节点地测试和验证
4. **保持简单** - 复杂逻辑拆分为多个简单节点
5. **错误处理** - 为关键节点添加错误处理逻辑
6. **文档记录** - 为复杂的表达式和逻辑添加注释

这些注意事项基于我们实际遇到的问题总结，遵循这些规则可以避免大部分Make工作流开发中的常见错误。
