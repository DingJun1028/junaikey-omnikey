import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 遵循「安全加固」原則，從環境變數中讀取 Firebase 配置
// 這些變數需要在 .env.local 檔案中定義
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 初始化 Firebase App
// 伺服器端渲染(SSR)或客戶端渲染(CSR)時，需要檢查 app 是否已初始化
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 導出 Firebase 各項服務的實例
// 這是「符文嵌合系統」的基礎，各個符文可以導入這些實例來與 Firebase 互動
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
