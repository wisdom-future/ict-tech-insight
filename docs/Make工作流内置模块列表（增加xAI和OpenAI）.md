**Make.com所有可用模块列表：**

根据您的脚本分析，以下是Make.com平台中可用的主要模块类型：

## **数据存储和表格模块：**

**Google Sheets模块：**
- `google-sheets:filterRows` - 筛选表格行数据
- `google-sheets:addRow` - 添加新行到表格
- `google-sheets:updateRow` - 更新表格行数据
- `google-sheets:deleteRow` - 删除表格行
- `google-sheets:getRow` - 获取特定行数据
- `google-sheets:createSpreadsheet` - 创建新的电子表格
- `google-sheets:getSpreadsheet` - 获取电子表格信息

**其他数据库模块：**
- `airtable:*` - Airtable数据库操作
- `mysql:*` - MySQL数据库连接
- `postgresql:*` - PostgreSQL数据库操作
- `mongodb:*` - MongoDB数据库操作

## **AI和机器学习模块：**

**OpenAI模块：**
- `openai-gpt-3:CreateCompletion` - GPT文本生成
- `openai-gpt-3:CreateImage` - DALL-E图像生成
- `openai-gpt-3:CreateEmbedding` - 文本嵌入向量
- `openai-gpt-3:CreateTranscription` - 语音转文字

**xAI模块：**
- `xai:createACompletion` - Grok模型文本生成
- `xai:createChatCompletion` - 对话式AI交互

**其他AI服务：**
- `anthropic:*` - Claude AI模型
- `cohere:*` - Cohere AI服务
- `huggingface:*` - Hugging Face模型

## **通信和消息模块：**

**邮件模块：**
- `email:ActionSendEmail` - 发送邮件
- `gmail:sendEmail` - 通过Gmail发送
- `outlook:sendEmail` - 通过Outlook发送
- `smtp:sendEmail` - SMTP协议发送

**即时通讯模块：**
- `slack:*` - Slack消息和频道操作
- `discord:*` - Discord机器人和消息
- `telegram:*` - Telegram机器人
- `whatsapp:*` - WhatsApp Business API
- `teams:*` - Microsoft Teams集成

## **内置工具模块：**

**数据处理：**
- `builtin:BasicFeeder` - 数组迭代器
- `builtin:BasicAggregator` - 数据聚合器
- `builtin:BasicRouter` - 条件路由器
- `builtin:Filter` - 数据过滤器
- `builtin:Iterator` - 高级迭代器

**变量和存储：**
- `util:SetVariables` - 设置多个变量
- `util:SetVariable2` - 设置单个变量
- `util:GetVariable` - 获取变量值
- `datastore:*` - 数据存储操作

**数据转换：**
- `json:ParseJSON` - JSON解析
- `json:CreateJSON` - JSON创建
- `xml:ParseXML` - XML解析
- `csv:ParseCSV` - CSV解析
- `base64:*` - Base64编码解码

## **文件和存储模块：**

**云存储：**
- `google-drive:*` - Google Drive文件操作
- `dropbox:*` - Dropbox文件管理
- `onedrive:*` - OneDrive文件操作
- `aws-s3:*` - Amazon S3存储

**文件处理：**
- `pdf:*` - PDF文件操作
- `image:*` - 图像处理和转换
- `archive:*` - 压缩文件处理

## **Web和API模块：**

**HTTP请求：**
- `http:makeRequest` - 发送HTTP请求
- `webhook:customWebhook` - 自定义Webhook
- `rest:*` - RESTful API调用

**网页操作：**
- `web-scraper:*` - 网页数据抓取
- `browser:*` - 浏览器自动化

## **电商和支付模块：**

**电商平台：**
- `shopify:*` - Shopify店铺管理
- `woocommerce:*` - WooCommerce集成
- `magento:*` - Magento电商平台

**支付处理：**
- `stripe:*` - Stripe支付处理
- `paypal:*` - PayPal支付集成

## **社交媒体模块：**

**主要平台：**
- `facebook:*` - Facebook页面和广告
- `twitter:*` - Twitter/X发布和管理
- `instagram:*` - Instagram内容管理
- `linkedin:*` - LinkedIn专业网络
- `youtube:*` - YouTube视频管理

## **项目管理模块：**

**任务管理：**
- `trello:*` - Trello看板管理
- `asana:*` - Asana项目管理
- `notion:*` - Notion数据库操作
- `jira:*` - Jira问题跟踪

## **CRM和销售模块：**

**客户关系管理：**
- `salesforce:*` - Salesforce CRM
- `hubspot:*` - HubSpot营销和销售
- `pipedrive:*` - Pipedrive销售管道
- `zoho:*` - Zoho CRM套件

## **时间和调度模块：**

**时间处理：**
- `datetime:*` - 日期时间操作
- `scheduler:*` - 定时任务调度
- `calendar:*` - 日历事件管理

## **开发和技术模块：**

**版本控制：**
- `github:*` - GitHub仓库管理
- `gitlab:*` - GitLab项目操作
- `bitbucket:*` - Bitbucket代码管理

**监控和分析：**
- `google-analytics:*` - Google Analytics数据
- `mixpanel:*` - Mixpanel事件跟踪

## **特殊功能模块：**

**加密和安全：**
- `crypto:*` - 加密解密操作
- `hash:*` - 哈希算法处理

**数学和计算：**
- `math:*` - 数学计算操作
- `text:*` - 文本处理和格式化

**地理位置：**
- `maps:*` - 地图和地理编码
- `location:*` - 位置服务

这个列表涵盖了Make.com平台上主要的模块类型，每个模块类别下通常都有多个具体的操作选项。实际使用时，您可以根据具体需求选择相应的模块和操作。模块的可用性可能会根据您的订阅计划和地区而有所不同。
