// Google Sheets API 接口

class SheetsAPI {
    constructor() {
        this.apiKey = CONFIG.GOOGLE_SHEETS.API_KEY;
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }
    
    // 获取表格数据
    async getSheetData(spreadsheetId, range) {
        try {
            const url = `${this.baseUrl}/${spreadsheetId}/values/${range}?key=${this.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.values || [];
        } catch (error) {
            console.error('获取表格数据失败:', error);
            throw error;
        }
    }
    
    // 获取工作流执行日志
    async getWorkflowLogs() {
        try {
            const spreadsheetId = CONFIG.GOOGLE_SHEETS.SPREADSHEET_IDS.OPERATIONS_DB;
            const range = 'Workflow_Execution_Log!A:Z';
            return await this.getSheetData(spreadsheetId, range);
        } catch (error) {
            console.error('获取工作流日志失败:', error);
            return [];
        }
    }
    
    // 获取情报数据
    async getIntelligenceData() {
        try {
            const spreadsheetId = CONFIG.GOOGLE_SHEETS.SPREADSHEET_IDS.INTELLIGENCE_DB;
            const range = 'Tech_Intelligence_Master!A:Z';
            return await this.getSheetData(spreadsheetId, range);
        } catch (error) {
            console.error('获取情报数据失败:', error);
            return [];
        }
    }
    
    // 获取数据质量报告
    async getDataQualityReports() {
        try {
            const spreadsheetId = CONFIG.GOOGLE_SHEETS.SPREADSHEET_IDS.OPERATIONS_DB;
            const range = 'Data_Quality_Reports!A:Z';
            return await this.getSheetData(spreadsheetId, range);
        } catch (error) {
            console.error('获取数据质量报告失败:', error);
            return [];
        }
    }
    
    // 获取原始数据统计
    async getRawDataStats() {
        try {
            const spreadsheetId = CONFIG.GOOGLE_SHEETS.SPREADSHEET_IDS.RAWDATA_DB;
            const sheets = [
                'Raw_Academic_Papers',
                'Raw_Patent_Data',
                'Raw_OpenSource_Data',
                'Raw_Tech_News',
                'Raw_Industry_Dynamics',
                'Raw_Competitor_Intelligence'
            ];
            
            const stats = {};
            for (const sheet of sheets) {
                const range = `${sheet}!A:S`;
                const data = await this.getSheetData(spreadsheetId, range);
                stats[sheet] = data;
            }
            
            return stats;
        } catch (error) {
            console.error('获取原始数据统计失败:', error);
            return {};
        }
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
