# GitHub AI 助理 (PR Review / Progress / Merge Advisor / Conflict Resolver / Labels Sync)

本套件將 PR 生命週期的重複動作自動化：
- AI PR Review：自動生成可執行的審查建議
- PR 進度追蹤：任務完成度、CI 摘要與合併可行性
- 合併顧問：依啟發式規則建議 SQUASH/REBASE/MERGE，條件允許時啟用 Auto-merge
- 衝突協助：對同倉庫分支嘗試自動 rebase 與啟發式修復
- 標籤同步：建立 ai、automerge-candidate、merge:* 等標籤

## 安裝與設定
1. 建立 Repository Secrets / Vars
   - AI_API_BASE = https://api.perplexity.ai
   - AI_API_KEY = <你的 Perplexity 金鑰>
   - AI_MODEL = sonar
2. （可選）啟用 Auto-merge：Settings → General → Pull Requests → Allow auto-merge
3. 同步標籤：在 Actions 觸發一次 "Labels Sync"（或 push 到 main 會自動執行）

## 安全邊界
- 來自 fork 的 PR：
  - ai-pr-review 使用 pull_request，無法讀取 secrets；若無金鑰，會安全跳過模型呼叫但仍留提示評論。
  - ai-merge-advisor 使用 pull_request_target 但不 checkout PR 內容；僅透過 GitHub API 讀取中立資訊與套用標籤。Auto-merge 僅在同倉庫分支時嘗試。
  - ai-conflict-resolver 僅在同倉庫分支時操作 rebase 與推送，對 fork 直接跳過。

## 工作流程概覽
- AI PR Review（.github/workflows/ai-pr-review.yml）
- PR 進度追蹤（.github/workflows/ai-progress-tracker.yml）
- 合併顧問（.github/workflows/ai-merge-advisor.yml）
- 衝突協助（.github/workflows/ai-conflict-resolver.yml）
- 標籤同步（.github/workflows/labels-sync.yml）

## 驗收建議
- 建立小 PR（例如 README 文字微調）
  - 應看到兩則評論：「🤖 AI Review」與「📊 PR 進度追蹤」
- 加上 automerge-candidate 標籤；審核通過且 CI 綠燈後應自動啟用 Auto-merge（同倉庫分支）
- 製造簡單衝突並加上 conflict:auto-fix 標籤，應嘗試 rebase 與自動修復（同倉庫分支）

## 疑難排解
- 未設 AI_API_KEY：AI Review 仍會留下占位評論，提示缺少金鑰。
- Auto-merge 失敗：確認已啟用 Auto-merge、具備必要審核與必須檢查、且 PR 來自同倉庫分支。
- 衝突解決失敗：可改為手動解決或在本地運行 rebase 後推送。