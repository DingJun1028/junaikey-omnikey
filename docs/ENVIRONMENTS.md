# 多環境與機密管理

- Firebase 專案：
  - dev：`jun-ai-key-dev`
  - staging：`jun-ai-key-staging`
  - prod：`jun-ai-key-prod`

- GitHub Secrets（範例）：
  - `FIREBASE_PROJECT_ID_STAGING`、`FIREBASE_SERVICE_ACCOUNT_STAGING`（JSON）
  - `FIREBASE_PROJECT_ID_PROD`、`FIREBASE_SERVICE_ACCOUNT_PROD`（JSON）
  - `SLACK_WEBHOOK`（通知）
  - `JULES_LOGIN`（Repository Variable，用於辨識 AI PR）

- PR 預覽（staging）：
  - 於 `pull_request` 事件部署 Firebase Hosting 預覽，產出臨時 URL 提供測試

- 正式部署：
  - `push` 到 `main` 時觸發 Hosting 正式部署（需審核與保護規則）