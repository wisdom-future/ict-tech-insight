基于最新搜集到的Google Sheets模块信息，以下是完整的Make工作流模块列表（包含Google Sheets）：

## Make工作流内置模块列表（完整版）

### 流程控制模块
- **`builtin:BasicFeeder`** - 数组迭代器，遍历数组中的每个元素
- **`builtin:BasicAggregator`** - 数据聚合器，收集多个数据包
- **`builtin:BasicRouter`** - 路由器，根据条件分发数据流
- **`builtin:BasicRepeater`** - 重复器，重复执行操作

### Google Sheets模块 (google-sheets)
#### 表格管理
- **`google-sheets:CreateSpreadsheet`** - 创建新电子表格
- **`google-sheets:CreateSpreadsheetFromTemplate`** - 从模板创建电子表格
- **`google-sheets:CopySheet`** - 复制工作表
- **`google-sheets:AddSheet`** - 添加工作表
- **`google-sheets:RenameSheet`** - 重命名工作表
- **`google-sheets:DeleteSheet`** - 删除工作表
- **`google-sheets:ListSheets`** - 列出所有工作表

#### 数据读取
- **`google-sheets:GetRangeValues`** - 获取范围值
- **`google-sheets:GetCell`** - 获取单元格值
- **`google-sheets:SearchRows`** - 搜索行
- **`google-sheets:SearchRowsAdvanced`** - 高级搜索行

#### 数据写入
- **`google-sheets:AddRow`** - 添加行
- **`google-sheets:BulkAddRows`** - 批量添加行
- **`google-sheets:UpdateRow`** - 更新行
- **`google-sheets:BulkUpdateRows`** - 批量更新行
- **`google-sheets:UpdateCell`** - 更新单元格

#### 数据删除/清空
- **`google-sheets:DeleteRow`** - 删除行
- **`google-sheets:ClearRow`** - 清空行
- **`google-sheets:ClearCell`** - 清空单元格
- **`google-sheets:ClearValuesFromRange`** - 清空范围值

#### 触发器
- **`google-sheets:WatchNewRows`** - 监听新行
- **`google-sheets:WatchChanges`** - 监听单元格变化

#### 条件格式
- **`google-sheets:AddConditionalFormatRule`** - 添加条件格式规则
- **`google-sheets:DeleteConditionalFormatRule`** - 删除条件格式规则

#### 自定义函数
- **`google-sheets:PerformFunction`** - 执行自定义函数
- **`google-sheets:PerformFunctionResponder`** - 自定义函数响应器

#### API调用
- **`google-sheets:MakeAPICall`** - 调用Google Sheets API

### xAI模块 (xAI Grok)
- **`xai:CreateCompletion`** - 使用Grok模型创建文本完成
- **`xai:CreateChatCompletion`** - 创建对话完成
- **`xai-community:CreateCompletion`** - 社区版xAI完成
- **`xai-community:CreateChatCompletion`** - 社区版xAI对话
- **`xai:MakeAPICall`** - 调用xAI API
- **`xai:CreateModeration`** - 内容审核

### OpenAI模块 (openai-gpt-3)
#### 文本生成
- **`openai-gpt-3:CreateCompletion`** - 创建文本完成 (GPT-3.5, GPT-4, GPT-4o, O1, O3, O4系列)
- **`openai-gpt-3:CreateChatCompletion`** - 创建对话完成
- **`openai-gpt-3:TransformTextToStructuredData`** - 将文本转换为结构化数据
- **`openai-gpt-3:AIMessage`** - AI助手消息处理

#### 图像处理
- **`openai-gpt-3:GenerateImage`** - 生成图像 (DALL-E 2, DALL-E 3, GPT-Image-1)
- **`openai-gpt-3:EditImage`** - 编辑图像
- **`openai-gpt-3:AnalyzeImage`** - 图像分析 (Vision)

#### 音频处理
- **`openai-gpt-3:CreateTranscription`** - 音频转录 (Whisper)
- **`openai-gpt-3:CreateTranslation`** - 音频翻译
- **`openai-gpt-3:GenerateAudio`** - 生成音频 (TTS)

#### 内容审核
- **`openai-gpt-3:CreateModeration`** - 内容审核

#### 文件管理
- **`openai-gpt-3:UploadFile`** - 上传文件
- **`openai-gpt-3:AddFilesToVectorStore`** - 添加文件到向量存储

#### 批处理
- **`openai-gpt-3:CreateBatch`** - 创建批处理
- **`openai-gpt-3:GetBatch`** - 获取批处理信息
- **`openai-gpt-3:ListBatches`** - 列出批处理
- **`openai-gpt-3:CancelBatch`** - 取消批处理
- **`openai-gpt-3:WatchBatchCompleted`** - 监听批处理完成 (触发器)

#### 响应管理
- **`openai-gpt-3:CreateModelResponse`** - 创建模型响应
- **`openai-gpt-3:GetModelResponse`** - 获取模型响应
- **`openai-gpt-3:DeleteModelResponse`** - 删除模型响应
- **`openai-gpt-3:ListInputItems`** - 列出输入项

#### API调用
- **`openai-gpt-3:MakeAPICall`** - 调用OpenAI API

### 数据处理模块
- **`util:SetVariable2`** - 设置单个变量
- **`util:SetVariables`** - 设置多个变量
- **`util:GetVariable`** - 获取变量值
- **`util:ComposeTransformer`** - 数据转换器
- **`util:TextAggregator`** - 文本聚合器
- **`util:ArrayAggregator`** - 数组聚合器

### HTTP和API模块
- **`http:ActionSendData`** - 发送HTTP请求
- **`http:ActionGetData`** - 获取HTTP数据
- **`http:TriggerWebhook`** - Webhook触发器
- **`http:TriggerCustomWebhook`** - 自定义Webhook

### 数据格式处理模块
- **`json:ParseJSON`** - 解析JSON数据
- **`json:CreateJSON`** - 创建JSON数据
- **`csv:ParseCSV`** - 解析CSV文件
- **`csv:CreateCSV`** - 创建CSV文件
- **`xml:ParseXML`** - 解析XML数据
- **`xml:CreateXML`** - 创建XML数据

### 文本处理模块
- **`text:TextParser`** - 文本解析器
- **`text:TextReplacer`** - 文本替换器
- **`text:TextSplitter`** - 文本分割器
- **`text:TextFormatter`** - 文本格式化器

### 邮件模块
- **`email:SendEmail`** - 发送邮件
- **`email:ParseEmail`** - 解析邮件
- **`email:TriggerEmail`** - 邮件触发器

### 数学和计算模块
- **`math:DoMath`** - 数学计算
- **`math:RoundNumber`** - 数字四舍五入
- **`math:FormatNumber`** - 数字格式化

### 时间和日期模块
- **`datetime:ParseDate`** - 解析日期
- **`datetime:FormatDate`** - 格式化日期
- **`datetime:AddTime`** - 时间计算
- **`datetime:GetTimestamp`** - 获取时间戳

### 文件处理模块
- **`file:ReadFile`** - 读取文件
- **`file:WriteFile`** - 写入文件
- **`file:CreateArchive`** - 创建压缩文件
- **`file:ExtractArchive`** - 解压文件

### 图像处理模块
- **`image:ResizeImage`** - 调整图像大小
- **`image:ConvertImage`** - 转换图像格式
- **`image:WatermarkImage`** - 添加水印

### 加密和安全模块
- **`crypto:HashData`** - 数据加密
- **`crypto:EncryptData`** - 数据加密
- **`crypto:DecryptData`** - 数据解密
- **`crypto:GenerateSignature`** - 生成签名

### 条件和逻辑模块
- **`condition:BasicCondition`** - 基本条件判断
- **`condition:AdvancedCondition`** - 高级条件判断
- **`condition:SwitchCondition`** - 条件切换

### 数据库模块
- **`database:QueryDatabase`** - 数据库查询
- **`database:InsertRecord`** - 插入记录
- **`database:UpdateRecord`** - 更新记录
- **`database:DeleteRecord`** - 删除记录

### 使用示例

**Google Sheets模块使用：**
```json
{
  "module": "google-sheets:AddRow",
  "version": 1,
  "parameters": {
    "spreadsheetId": "1ABC123...",
    "sheetName": "Sheet1",
    "values": ["Name", "Email", "Status"]
  }
}
```

**Google Sheets搜索行：**
```json
{
  "module": "google-sheets:SearchRows",
  "version": 1,
  "parameters": {
    "spreadsheetId": "1ABC123...",
    "sheetName": "Sheet1",
    "filter": [{"field": "Email", "operator": "contains", "value": "@gmail.com"}]
  }
}
```

**Google Sheets监听新行：**
```json
{
  "module": "google-sheets:WatchNewRows",
  "version": 1,
  "parameters": {
    "spreadsheetId": "1ABC123...",
    "sheetName": "Sheet1",
    "tableContainsHeaders": true
  }
}
```
