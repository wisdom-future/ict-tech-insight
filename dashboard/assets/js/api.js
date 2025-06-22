// Google Sheets API 增强版接口

class SheetsAPI {
    constructor() {
        this.apiKey = CONFIG.GOOGLE_SHEETS.API_KEY;
        this.baseUrl = CONFIG.API.BASE_URL;
        this.databases = CONFIG.GOOGLE_SHEETS.DATABASES;
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.rateLimitDelay = 100; // 100ms between requests
    }

    // 通用方法：获取指定数据库的指定工作表数据
    async getSheetData(database, sheetName, range = '') {
        try {
            Utils.performance.mark(`api_start_${database}_${sheetName}`);

            const dbConfig = this.databases[database];
            if (!dbConfig) {
                throw new Error(`数据库 ${database} 配置不存在`);
            }

            const spreadsheetId = dbConfig.SPREADSHEET_ID;
            const actualSheetName = dbConfig.SHEETS[sheetName];

            if (!actualSheetName) {
                throw new Error(`工作表 ${sheetName} 在数据库 ${database} 中不存在`);
            }

            // 检查缓存
            const cacheKey = `${database}_${sheetName}_${range}`;
            const cached = Utils.getCache(cacheKey);

            if (cached) {
                console.log(`[API] 使用缓存数据: ${cacheKey}`);
                return cached;
            }

            const fullRange = range ? `${actualSheetName}!${range}` : actualSheetName;
            const url = `${this.baseUrl}/${spreadsheetId}/values/${fullRange}?key=${this.apiKey}`;

            const response = await this.makeRequest(url);
            const data = response.values || [];

            // 缓存结果
            Utils.setCache(cacheKey, data);
            Utils.performance.measure(`API请求_${database}_${sheetName}`, `api_start_${database}_${sheetName}`);

            return data;
        } catch (error) {
            const errorInfo = Utils.handleError(error, `getSheetData(${database}, ${sheetName})`);
            throw new Error(errorInfo.message);
        }
    }

    // 批量获取多个工作表数据
    async getBatchSheetData(requests) {
        try {
            const results = {};

            // 分组请求以避免API限制
            const batchSize = CONFIG.REFRESH.BATCH_SIZE || 10;
            for (let i = 0; i < requests.length; i += batchSize) {
                const batch = requests.slice(i, i + batchSize);
                const batchPromises = batch.map(req =>
                    this.getSheetData(req.database, req.sheet, req.range)
                        .then(data => ({ key: req.key || `${req.database}_${req.sheet}`, data }))
                        .catch(error => ({ key: req.key || `${req.database}_${req.sheet}`, error }))
                );

                const batchResults = await Promise.all(batchPromises);

                batchResults.forEach(result => {
                    if (result.error) {
                        console.error(`批量请求失败 ${result.key}:`, result.error);
                        results[result.key] = [];
                    } else {
                        results[result.key] = result.data;
                    }
                });

                // 批次间延迟
                if (i + batchSize < requests.length) {
                    await Utils.delay(this.rateLimitDelay);
                }
            }

            return results;
        } catch (error) {
            console.error('批量获取数据失败:', error);
            throw error;
        }
    }

    // HTTP请求封装
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: CONFIG.API.REQUEST_HEADERS,
            timeout: CONFIG.REFRESH.TIMEOUT
        };

        const requestOptions = { ...defaultOptions, ...options };

        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

        try {
            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('请求超时，请检查网络连接');
            }

            throw error;
        }
    }

    // 配置数据库相关方法
    async getTechnologyRegistry() {
        return await this.getSheetData('CONFIG_DB', 'TECHNOLOGY_REGISTRY', 'A:O');
    }

    async getCompetitorRegistry() {
        return await this.getSheetData('CONFIG_DB', 'COMPETITOR_REGISTRY', 'A:S');
    }

    async getConferenceRegistry() {
        return await this.getSheetData('CONFIG_DB', 'CONFERENCE_REGISTRY', 'A:M');
    }

    // 原始数据库相关方法
    async getRawAcademicPapers() {
        return await this.getSheetData('RAWDATA_DB', 'RAW_ACADEMIC_PAPERS', 'A:S');
    }

    async getRawPatentData() {
        return await this.getSheetData('RAWDATA_DB', 'RAW_PATENT_DATA', 'A:U');
    }

    async getRawOpenSourceData() {
        return await this.getSheetData('RAWDATA_DB', 'RAW_OPENSOURCE_DATA', 'A:U');
    }

    async getRawTechNews() {
        return await this.getSheetData('RAWDATA_DB', 'RAW_TECH_NEWS', 'A:T');
    }

    async getRawIndustryDynamics() {
        return await this.getSheetData('RAWDATA_DB', 'RAW_INDUSTRY_DYNAMICS', 'A:T');
    }

    async getRawCompetitorIntelligence() {
        return await this.getSheetData('RAWDATA_DB', 'RAW_COMPETITOR_INTELLIGENCE', 'A:T');
    }

    // 洞察数据库相关方法
    async getTechIntelligenceMaster() {
        return await this.getSheetData('INTELLIGENCE_DB', 'TECH_INTELLIGENCE_MASTER', 'A:X');
    }

    async getEvidenceValidationMatrix() {
        return await this.getSheetData('INTELLIGENCE_DB', 'EVIDENCE_VALIDATION_MATRIX', 'A:R');
    }

    async getCommercialValueQuantification() {
        return await this.getSheetData('INTELLIGENCE_DB', 'COMMERCIAL_VALUE_QUANTIFICATION', 'A:Z');
    }

    async getCompetitiveIntelligenceMonitor() {
        return await this.getSheetData('INTELLIGENCE_DB', 'COMPETITIVE_INTELLIGENCE_MONITOR', 'A:U');
    }

    async getTechnicalDeepAnalysis() {
        return await this.getSheetData('INTELLIGENCE_DB', 'TECHNICAL_DEEP_ANALYSIS', 'A:AA');
    }

    async getActionRecommendations() {
        return await this.getSheetData('INTELLIGENCE_DB', 'ACTION_RECOMMENDATIONS', 'A:FF');
    }

    // 运营数据库相关方法
    async getWorkflowExecutionLog() {
        return await this.getSheetData('OPERATIONS_DB', 'WORKFLOW_EXECUTION_LOG', 'A:AA');
    }

    async getDataQualityReports() {
        return await this.getSheetData('OPERATIONS_DB', 'DATA_QUALITY_REPORTS', 'A:DD');
    }

    // 批量获取方法
    async getAllConfigData() {
        const requests = [
            { database: 'CONFIG_DB', sheet: 'TECHNOLOGY_REGISTRY', range: 'A:O', key: 'TECHNOLOGY_REGISTRY' },
            { database: 'CONFIG_DB', sheet: 'COMPETITOR_REGISTRY', range: 'A:S', key: 'COMPETITOR_REGISTRY' },
            { database: 'CONFIG_DB', sheet: 'CONFERENCE_REGISTRY', range: 'A:M', key: 'CONFERENCE_REGISTRY' }
        ];

        return await this.getBatchSheetData(requests);
    }

    async getAllRawDataStats() {
        const requests = [
            { database: 'RAWDATA_DB', sheet: 'RAW_ACADEMIC_PAPERS', range: 'A:S', key: 'RAW_ACADEMIC_PAPERS' },
            { database: 'RAWDATA_DB', sheet: 'RAW_PATENT_DATA', range: 'A:U', key: 'RAW_PATENT_DATA' },
            { database: 'RAWDATA_DB', sheet: 'RAW_OPENSOURCE_DATA', range: 'A:U', key: 'RAW_OPENSOURCE_DATA' },
            { database: 'RAWDATA_DB', sheet: 'RAW_TECH_NEWS', range: 'A:T', key: 'RAW_TECH_NEWS' },
            { database: 'RAWDATA_DB', sheet: 'RAW_INDUSTRY_DYNAMICS', range: 'A:T', key: 'RAW_INDUSTRY_DYNAMICS' },
            { database: 'RAWDATA_DB', sheet: 'RAW_COMPETITOR_INTELLIGENCE', range: 'A:T', key: 'RAW_COMPETITOR_INTELLIGENCE' }
        ];

        return await this.getBatchSheetData(requests);
    }

    async getAllIntelligenceData() {
        const requests = [
            { database: 'INTELLIGENCE_DB', sheet: 'TECH_INTELLIGENCE_MASTER', range: 'A:X', key: 'TECH_INTELLIGENCE_MASTER' },
            { database: 'INTELLIGENCE_DB', sheet: 'EVIDENCE_VALIDATION_MATRIX', range: 'A:R', key: 'EVIDENCE_VALIDATION_MATRIX' },
            { database: 'INTELLIGENCE_DB', sheet: 'COMMERCIAL_VALUE_QUANTIFICATION', range: 'A:Z', key: 'COMMERCIAL_VALUE_QUANTIFICATION' },
            { database: 'INTELLIGENCE_DB', sheet: 'COMPETITIVE_INTELLIGENCE_MONITOR', range: 'A:U', key: 'COMPETITIVE_INTELLIGENCE_MONITOR' },
            { database: 'INTELLIGENCE_DB', sheet: 'TECHNICAL_DEEP_ANALYSIS', range: 'A:AA', key: 'TECHNICAL_DEEP_ANALYSIS' },
            { database: 'INTELLIGENCE_DB', sheet: 'ACTION_RECOMMENDATIONS', range: 'A:FF', key: 'ACTION_RECOMMENDATIONS' }
        ];

        return await this.getBatchSheetData(requests);
    }

    async getAllOperationsData() {
        const requests = [
            { database: 'OPERATIONS_DB', sheet: 'WORKFLOW_EXECUTION_LOG', range: 'A:AA', key: 'WORKFLOW_EXECUTION_LOG' },
            { database: 'OPERATIONS_DB', sheet: 'DATA_QUALITY_REPORTS', range: 'A:DD', key: 'DATA_QUALITY_REPORTS' }
        ];

        return await this.getBatchSheetData(requests);
    }

    // 数据处理辅助方法
    processWorkflowData(rawData) {
        if (!rawData || rawData.length <= 1) return [];

        const headers = rawData[0];
        const mapping = CONFIG.COLUMN_MAPPINGS.WORKFLOW_EXECUTION_LOG;

        return rawData.slice(1).map(row => ({
            executionId: row[mapping.EXECUTION_ID] || '',
            workflowName: row[mapping.WORKFLOW_NAME] || '',
            workflowVersion: row[mapping.WORKFLOW_VERSION] || '',
            executionStatus: row[mapping.EXECUTION_STATUS] || '',
            startTimestamp: row[mapping.START_TIMESTAMP] || '',
            endTimestamp: row[mapping.END_TIMESTAMP] || '',
            durationSeconds: parseInt(row[mapping.DURATION_SECONDS]) || 0,
            processedRecords: parseInt(row[mapping.PROCESSED_RECORDS]) || 0,
            successCount: parseInt(row[mapping.SUCCESS_COUNT]) || 0,
            errorCount: parseInt(row[mapping.ERROR_COUNT]) || 0,
            warningCount: parseInt(row[mapping.WARNING_COUNT]) || 0,
            triggerSource: row[mapping.TRIGGER_SOURCE] || ''
        }));
    }

    processIntelligenceData(rawData) {
        if (!rawData || rawData.length <= 1) return [];

        const headers = rawData[0];
        const mapping = CONFIG.COLUMN_MAPPINGS.TECH_INTELLIGENCE_MASTER;

        return rawData.slice(1).map(row => ({
            intelligenceId: row[mapping.INTELLIGENCE_ID] || '',
            techId: row[mapping.TECH_ID] || '',
            techKeyword: row[mapping.TECH_KEYWORD] || '',
            title: row[mapping.TITLE] || '',
            contentSummary: row[mapping.CONTENT_SUMMARY] || '',
            dataType: row[mapping.DATA_TYPE] || '',
            sourceUrl: row[mapping.SOURCE_URL] || '',
            triggerSource: row[mapping.TRIGGER_SOURCE] || '',
            signalStrength: parseFloat(row[mapping.SIGNAL_STRENGTH]) || 0,
            breakthroughScore: parseFloat(row[mapping.BREAKTHROUGH_SCORE]) || 0,
            commercialValueScore: parseFloat(row[mapping.COMMERCIAL_VALUE_SCORE]) || 0,
            confidenceLevel: row[mapping.CONFIDENCE_LEVEL] || '',
            priorityLevel: row[mapping.PRIORITY_LEVEL] || '',
            processingStatus: row[mapping.PROCESSING_STATUS] || '',
            createdTimestamp: row[mapping.CREATED_TIMESTAMP] || ''
        }));
    }

    processQualityData(rawData) {
        if (!rawData || rawData.length <= 1) return [];

        const headers = rawData[0];
        const mapping = CONFIG.COLUMN_MAPPINGS.DATA_QUALITY_REPORTS;

        return rawData.slice(1).map(row => ({
            reportId: row[mapping.REPORT_ID] || '',
            reportDate: row[mapping.REPORT_DATE] || '',
            dataSource: row[mapping.DATA_SOURCE] || '',
            tableName: row[mapping.TABLE_NAME] || '',
            totalRecords: parseInt(row[mapping.TOTAL_RECORDS]) || 0,
            validRecords: parseInt(row[mapping.VALID_RECORDS]) || 0,
            dataAccuracyPercentage: parseFloat(row[mapping.DATA_ACCURACY_PERCENTAGE]) || 0,
            dataCompletenessPercentage: parseFloat(row[mapping.DATA_COMPLETENESS_PERCENTAGE]) || 0,
            dataConsistencyPercentage: parseFloat(row[mapping.DATA_CONSISTENCY_PERCENTAGE]) || 0,
            overallQualityScore: parseFloat(row[mapping.OVERALL_QUALITY_SCORE]) || 0
        }));
    }

    // 连接测试
    async testConnection() {
        try {
            Utils.performance.mark('connection_test_start');

            // 测试最小的请求
            const testData = await this.getSheetData('CONFIG_DB', 'TECHNOLOGY_REGISTRY', 'A1:A1');

            Utils.performance.measure('连接测试', 'connection_test_start');

            return {
                success: true,
                message: 'API连接正常',
                responseTime: Utils.performance.marks.get('connection_test_start')
            };
        } catch (error) {
            return {
                success: false,
                message: `连接失败: ${error.message}`,
                error: error
            };
        }
    }

    // 获取API使用统计
    getApiStats() {
        return {
            cacheHits: Utils.cache.size,
            requestQueue: this.requestQueue.length,
            rateLimitDelay: this.rateLimitDelay,
            lastError: this.lastError || null
        };
    }

    // 清理缓存和重置状态
    reset() {
        Utils.clearCache();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.lastError = null;
    }
}

// 创建API实例
const api = new SheetsAPI();

// 导出API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SheetsAPI, api };
} else if (typeof window !== 'undefined') {
    window.SheetsAPI = SheetsAPI;
    window.api = api;
}
