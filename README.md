# junaikey-omnikey

本專案是 Next.js 14 應用，並整合：
- Firebase Auth（GitHub Provider）作為前端登入
- Firebase Cloud Functions：
  - `POST /api/github/webhook`：驗證 X-Hub-Signature-256，將事件寫入 Firestore `github_events/{deliveryId}`
  - `ALL /api/junaikey/*`：以 Secret 管理金鑰的安全代理，避免前端曝露 junaikey 金鑰

## 先決條件
- Node.js 18+（建議 20）
- Firebase CLI：`npm i -g firebase-tools`
- Firebase 專案 ID（dev/staging/prod）
- GitHub OAuth App（提供給 Firebase Auth Provider）
- junaikey 的 Base URL 與授權方式（API Key / Bearer / Header 名稱）

## 設定步驟

### 1) Firebase 專案與 Secrets
```bash
firebase login
# 設定預設專案（也可直接編輯 .firebaserc）
firebase use ```

### 2) Firebase Auth 啟用 GitHub Provider
- Firebase Console → Authentication → Sign-in method → 啟用 GitHub
- 填寫 GitHub OAuth App 的 Client ID / Secret
- 於 `.env.local`（依 `.env.local.example`）填入 Firebase Web Config

### 3) GitHub Webhook
- GitHub → 你的 repo → Settings → Webhooks
- Payload URL: `https://us-central1-<your-firebase-project-id>.cloudfunctions.net/api/github/webhook`
- Content type: `application/json`
- Secret: 與 `GITHUB_WEBHOOK_SECRET` 一致
- 事件：可先勾 `Just the push event`

### 4) 本機開發
```bash
# 安裝前端依賴
npm ci

# 安裝 Functions 依賴
cd functions && npm ci && cd ..

# 啟動 Next 開發伺服器
npm run dev
```

若需本機整合測試 Functions，建議使用 Emulator：
```bash
cd functions && npm run build && cd ..
firebase emulators:start --only functions,firestore
```

### 5) 部署
```bash
# 部署 Functions
cd functions
npm run deploy
```

### 6) GitHub Actions
在 repo 設定 Secrets：
- `FIREBASE_TOKEN`、`FIREBASE_PROJECT_ID`（或使用多環境 secrets，見 docs/ENVIRONMENTS.md）
- `FIREBASE_PROJECT_ID_STAGING`、`FIREBASE_SERVICE_ACCOUNT_STAGING`（JSON）
- `FIREBASE_PROJECT_ID_PROD`、`FIREBASE_SERVICE_ACCOUNT_PROD`（JSON）
- `SLACK_WEBHOOK`
- Repository Variable：`JULES_LOGIN`

Push 到 `main` 會自動部署 Functions；PR 會建立 Hosting 預覽並通知 Slack。

## 環境變數
- `.env.local`（見 `.env.local.example`）：
  - `NEXT_PUBLIC_FIREBASE_*`：Firebase Web Config
  - `NEXT_PUBLIC_API_BASE`：預設 `/api`（使用 Firebase Hosting rewrite）。若直連雲端函式，填入完整 URL。

## Firestore 結構
- `github_events/{deliveryId}`：儲存 webhook 事件快照
- `users/{uid}`：如需擴充可儲存使用者資料（目前前端僅做登入示範）

## 規範與流程
- 參考 docs/BRANCHING.md、docs/AI_COLLAB.md、docs/CONFLICTS_PLAYBOOK.md 與 docs/ENVIRONMENTS.md
- 設定 main 為受保護分支（需要在 GitHub Repo Settings 中手動設定：必須通過 CI、至少 1 位 reviewer、禁止直接 push）
