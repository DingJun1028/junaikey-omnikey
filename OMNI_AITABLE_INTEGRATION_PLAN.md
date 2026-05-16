# OmniTable (AITable) 深度整合實作計畫
**專案**: ESGss JunAiKey Beta | **文檔狀態**: 已實施 (Implemented) | **優先級**: 高

---

## 📊 執行摘要
OmniTable 作為專案的輕量級 NoSQL 後端，補充 PostgreSQL，提供靈活的資料管理。建立雙向同步架構，涵蓋 CRM、PM、ESG 數據與知識庫。

## 🎯 核心目標
1.  **增強 AITable Service**: 實作 CRUD、Fields、Views、Batch 批量操作與錯誤重試。
2.  **建立雙向同步**: 支援 InfoOne ↔ AITable (Webhook/Push)，解決更新衝突。
3.  **Admin Dashboard**: 提供同步監控、手動觸發與數據映射配置介面。

## 🏗️ 資料結構規劃 (Datasheets)
*   **Customers**: 公司名稱、產業、規模 (源自 BoostSpace)。
*   **Projects**: 專案名稱、狀態、負責人。
*   **ESG_Metrics**: 指標類型、數值、時間戳。
*   **Documents**: 標題、分類、標籤、內容（源自 5T 知識編織）。

## 📋 實施階段 (Phases)
### Phase 1: 基礎 Service (已完成)
*   建立 `AITableService.ts` 與 `aitable.types.ts`。
*   支援 Fields 與 Views 管理。

### Phase 2: 同步架構 (已完成)
*   建立 `AITableSyncService.ts` 與 `aitableSync` 路由。
*   部署 `010_aitable_sync_log.sql` 遷移腳本。

### Phase 3: 管理後台 (已完成)
*   部署 `/admin/aitable` 頁面。
*   包含 `SyncDashboard`, `ConflictManager`, `DataMapper` 組件。

---
**當前狀態**: 100% 生產就緒。🚀
