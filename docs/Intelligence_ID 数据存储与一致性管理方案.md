# Intelligence_ID 数据存储与一致性管理方案

## **Intelligence_ID 生成与分配机制**

### **1. ID生成规则**

**格式设计：**
```
TI + YYYYMMDD + 序号 + 类别码
例：TI20241219001A  (AI/ML类别)
例：TI20241219002Q  (Quantum类别)
例：TI20241219003B  (Biotech类别)
```

**类别码映射：**
- A = AI/ML
- Q = Quantum Computing  
- B = Biotech
- E = Energy
- M = Materials
- R = Robotics

### **2. ID生成时机**

**在Make工作流中的生成节点：**
```
数据采集 → 初步AI分析 → 信号识别 → 生成Intelligence_ID → 写入主表
```

**生成条件：**
- 技术信号强度 ≥ 6.0
- 至少有2个有效数据源
- AI初步分析置信度 ≥ 70%

## **数据存储先后关系**

### **阶段1：主表记录创建（优先级：最高）**

**首先写入 Tech_Intelligence_Master：**
```
Step 1: 生成 intelligence_id = "TI20241219001A"
Step 2: 写入基础字段
- signal_title
- tech_category  
- discovery_timestamp
- signal_strength (AI初步评分)
- signal_lifecycle_status = "Active"

Step 3: 写入默认值
- confidence_level = 0.00 (待计算)
- commercial_value_score = 0.0 (待计算)  
- competitive_threat_level = 0.0 (待计算)
- evidence_validation_status = "Pending"
- expert_validation_status = "Pending"
```

### **阶段2：证据验证记录创建（优先级：高）**

**写入 Evidence_Validation_Matrix：**
```
Step 1: 使用主表的 intelligence_id 作为外键
Step 2: 生成 validation_id = intelligence_id + "_EV"
       例：TI20241219001A_EV

Step 3: 写入证据数据
- primary_source_url (来自数据采集)
- primary_source_type (自动识别)
- secondary_source_url (如果有)
- link_accessibility_status = "Pending" (待验证)

Step 4: 初始化评分字段
- primary_source_authority_score = 0.0 (待计算)
- overall_evidence_quality = 0.0 (待计算)
```

### **阶段3：并行分析记录创建（优先级：中）**

**同时写入三个分析表：**

**3.1 Commercial_Value_Quantification：**
```
value_id = intelligence_id + "_CV"
例：TI20241219001A_CV

初始状态：所有商业价值字段 = 0 或 NULL
等待AI商业价值分析完成后更新
```

**3.2 Competitive_Intelligence_Monitor：**
```
monitor_id = intelligence_id + "_CI" 
例：TI20241219001A_CI

初始状态：
- threat_level_current = "Low"
- monitoring_frequency = "Daily"
- 其他分析字段 = 空或默认值
```

**3.3 Action_Recommendations：**
```
recommendation_id = intelligence_id + "_AR"
例：TI20241219001A_AR

初始状态：所有建议字段 = 空
等待综合分析完成后生成
```

## **数据一致性保证机制**

### **1. Make工作流中的写入顺序控制**

**工作流模块设计：**
```
Module 1: 主表写入器
- 输入：原始技术数据
- 输出：intelligence_id
- 状态：记录创建完成

Module 2: 证据表写入器  
- 输入：intelligence_id + 证据数据
- 前置条件：Module 1 完成
- 输出：证据记录创建完成

Module 3: 分析表初始化器
- 输入：intelligence_id
- 前置条件：Module 1 完成
- 输出：3个分析表记录创建完成
- 执行方式：并行创建

Module 4: AI分析更新器
- 输入：intelligence_id + AI分析结果
- 前置条件：Module 2, 3 完成
- 输出：所有表数据更新完成
```

### **2. Google Sheets中的一致性检查**

**在每个表中添加状态列：**

**Tech_Intelligence_Master 添加：**
- `data_completeness_status` = "Incomplete/Complete"
- `last_sync_timestamp` = 最后同步时间

**其他表添加：**
- `sync_status` = "Pending/Synced/Error"
- `parent_record_exists` = TRUE/FALSE (检查主表记录是否存在)

### **3. 数据完整性验证逻辑**

**在Make工作流中的验证步骤：**

**步骤1：主表记录验证**
```
检查条件：
- intelligence_id 存在
- 必填字段不为空
- discovery_timestamp 有效
- tech_category 在允许值范围内
```

**步骤2：关联表记录验证**
```
对每个 intelligence_id 检查：
- Evidence_Validation_Matrix 是否有对应记录
- Commercial_Value_Quantification 是否有对应记录  
- Competitive_Intelligence_Monitor 是否有对应记录
- Action_Recommendations 是否有对应记录
```

**步骤3：数据完整性评分**
```
完整性评分 = (存在的关联表数量 / 4) × 100%

更新主表字段：
data_completeness_status = 
  - "Complete" (100%)
  - "Partial" (50-99%)  
  - "Incomplete" (<50%)
```

## **Make工作流中的错误处理**

### **1. 写入失败处理**

**主表写入失败：**
```
错误处理：
1. 记录错误日志
2. 重试机制（最多3次）
3. 如果仍失败，发送错误通知
4. 不继续后续步骤
```

**关联表写入失败：**
```
错误处理：
1. 标记主表 data_completeness_status = "Incomplete"
2. 记录具体失败的表名
3. 设置重试计划
4. 继续其他表的写入
```

### **2. 数据同步修复机制**

**定期同步检查工作流：**
```
触发频率：每日凌晨3:00

检查逻辑：
1. 读取所有 data_completeness_status = "Incomplete" 的记录
2. 检查缺失的关联表记录
3. 尝试补充缺失数据
4. 更新完整性状态
```

## **Intelligence_ID 在各表中的追踪**

### **1. 数据流追踪表设计**

**新增辅助表：Intelligence_Data_Flow_Tracker**
```
字段设计：
A: intelligence_id - 主键
B: main_table_status - 主表状态 (Created/Updated/Error)
C: evidence_table_status - 证据表状态
D: commercial_table_status - 商业价值表状态  
E: competitive_table_status - 竞争情报表状态
F: action_table_status - 行动建议表状态
G: overall_completion_percentage - 总体完成度
H: last_update_attempt - 最后更新尝试时间
I: error_messages - 错误信息
J: next_retry_time - 下次重试时间
```

### **2. 实时状态更新机制**

**在Make工作流每个写入模块后添加状态更新：**

**主表写入后：**
```
更新 Intelligence_Data_Flow_Tracker：
- main_table_status = "Created"
- overall_completion_percentage = 20%
- last_update_attempt = 当前时间
```

**证据表写入后：**
```
更新状态：
- evidence_table_status = "Created"  
- overall_completion_percentage = 40%
```

**所有分析表完成后：**
```
更新状态：
- commercial_table_status = "Created"
- competitive_table_status = "Created"
- action_table_status = "Created"
- overall_completion_percentage = 100%
```

## **数据查询时的一致性保证**

### **1. 查询前置检查**

**在生成报告前检查：**
```
对每个要输出的 intelligence_id：
1. 检查 overall_completion_percentage ≥ 80%
2. 检查关键字段不为空：
   - confidence_level > 0
   - commercial_value_score > 0
   - evidence_validation_status ≠ "Pending"
3. 只有通过检查的记录才进入报告
```

### **2. 数据补全机制**

**发现数据不完整时：**
```
处理策略：
1. 如果缺失非关键数据：使用默认值或标记"待分析"
2. 如果缺失关键数据：触发补全工作流
3. 如果补全失败：从报告中排除该记录
4. 记录问题并安排人工审核
```

这个设计确保了：

1. **唯一性**：每个技术线索有唯一的intelligence_id
2. **完整性**：通过状态追踪确保所有相关数据都被创建
3. **一致性**：通过先后顺序控制避免数据不一致
4. **可恢复性**：通过错误处理和重试机制保证数据完整
5. **可追踪性**：通过状态表随时了解数据完整情况

Jason，这样的intelligence_id管理和一致性保证机制是否能满足Make工作流的实际需求？
