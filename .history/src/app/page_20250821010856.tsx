import { useEffect, useState } from "react";
import React from "react";
import {
  AitableClient,
  BoostspaceClient,
  CapacitiesClient,
  GithubClient,
  JulesClient,
  StraicoClient,
  FirebaseClient,
  InfoflowClient,
  VSCodeClient,
} from "./clients";
import { useSyncEngine } from "./syncEngine";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskList } from "./components/TaskList";
import { StraicoAgent, Sigil } from "./straicoAgent";
import { OmniMind } from "./omniMind";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

// Firestore 初始化
const firebaseConfig = {
  apiKey: "AIzaSyDSbGYn-GHa8Q_FQ8TnuHwySJA3rGEiQtQ",
  authDomain: "junaikey-genesis.firebaseapp.com",
  projectId: "junaikey-genesis",
  storageBucket: "junaikey-genesis.appspot.com",
  messagingSenderId: "1080502198465",
  appId: "1:1080502198465:web:10fa21b63401529181b440"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore 寫入神諭、日誌、智慧分析
const saveOracleToFirestore = async (oracle: any) => {
  await addDoc(collection(db, "oracles"), {
    ...oracle,
    createdAt: Timestamp.now()
  });
};
const saveLogToFirestore = async (log: string) => {
  await addDoc(collection(db, "logs"), {
    log,
    createdAt: Timestamp.now()
  });
};
const saveInsightToFirestore = async (insight: string) => {
  await addDoc(collection(db, "insights"), {
    insight,
    createdAt: Timestamp.now()
  });
};

// Firestore 查詢神諭、日誌、智慧分析
const fetchOracles = async () => {
  const querySnapshot = await getDocs(collection(db, "oracles"));
  return querySnapshot.docs.map(doc => doc.data());
};
const fetchLogs = async () => {
  const querySnapshot = await getDocs(collection(db, "logs"));
  return querySnapshot.docs.map(doc => doc.data());
};
const fetchInsights = async () => {
  const querySnapshot = await getDocs(collection(db, "insights"));
  return querySnapshot.docs.map(doc => doc.data());
};

export default function Home() {
  // 統一狀態管理，避免重複 API 呼叫與無限迴圈
  const [data, setData] = useState({
    boostspace: [],
    aitable: [],
    capacities: [],
    github: null,
    jules: "",
    straico: [],
    firebase: [],
    infoflow: [],
    vscode: [],
  });
  const [syncing, setSyncing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("boostspace");
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState<any>(null);
  const [sigil, setSigil] = useState<Sigil | null>(null);
  const [oracle, setOracle] = useState<any>(null);
  const [matrixInsight, setMatrixInsight] = useState<string>("");

  const { conflicts, batchSync } = useSyncEngine(
    data,
    msg => setSyncLog(log => [...log, msg]),
    { platforms: ["boostspace", "aitable", "capacities", "straico", "firebase", "infoflow"] }
  );

  useEffect(() => {
    if (syncing) return; // 防止無限迴圈
    setSyncing(true);
    (async () => {
      try {
        // Boost.space
        const boostClient = new BoostspaceClient("tasks");
        const boostspaceData = await boostClient.getItems();
        // Aitable
        const aitableClient = new AitableClient("Tasks");
        const aitableData = await aitableClient.getRecords();
        // Capacities
        const capClient = new CapacitiesClient("notes");
        const capacitiesData = await capClient.getItems();
        // Github
        const ghClient = new GithubClient("owner/repo");
        const githubData = await ghClient.getRepoInfo();
        // Jules
        const julesClient = new JulesClient();
        const julesData = await julesClient.generateContent("請用繁體中文介紹台灣的夜市文化");
        // Straico
        const straicoClient = new StraicoClient("tasks");
        const straicoData = await straicoClient.getItems();
        // Firebase
        const firebaseClient = new FirebaseClient("tasks");
        const firebaseData = await firebaseClient.getDocuments();
        // Infoflow
        const infoflowClient = new InfoflowClient("tasks");
        const infoflowData = await infoflowClient.getItems();
        // VSCode
        const vscodeClient = new VSCodeClient("extensions");
        const vscodeData = await vscodeClient.getItems();
        // 統一更新狀態
        setData({
          boostspace: boostspaceData,
          aitable: aitableData,
          capacities: capacitiesData,
          github: githubData,
          jules: julesData,
          straico: straicoData,
          firebase: firebaseData,
          infoflow: infoflowData,
          vscode: vscodeData,
        });
      } catch (err) {
        console.error("API 串接錯誤:", err);
      } finally {
        setSyncing(false);
      }
    })();
  }, [syncing]);

  // Straico 授權流程：取得符令
  const requestStraicoSigil = () => {
    const newSigil = StraicoAgent.requestSigil("frontend-user", ["gemini:invoke"]);
    setSigil(newSigil);
    setSyncLog(log => [...log, `已取得 Straico 符令: ${newSigil.id}`]);
  };

  // Gemini API 代理呼叫範例
  const callGeminiViaStraico = async () => {
    if (!sigil) {
      setSyncLog(log => [...log, "請先取得 Straico 符令"]);
      return;
    }
    try {
      const res = await StraicoAgent.proxyGeminiRequest(sigil, { prompt: "請用繁體中文介紹台灣的夜市文化" });
      setSyncLog(log => [...log, `Gemini 回應: ${JSON.stringify(res)}`]);
    } catch (err) {
      setSyncLog(log => [...log, `Gemini 代理失敗: ${err}`]);
    }
  };

  // 發布神諭（創元意志）
  const handleIssueOracle = async () => {
    const o = await OmniMind.issueOracle("系統優化", "請優化過去24小時最耗時的任務流程");
    setOracle(o);
    setSyncLog(log => [...log, `已發布神諭: ${o.id}`]);
    await saveOracleToFirestore(o);
    await saveLogToFirestore(`已發布神諭: ${o.id}`);
  };

  // 查詢終始矩陣（智慧層）
  const handleQueryMatrix = async () => {
    const res = await OmniMind.queryMatrix("如何提升系統安全性？");
    setMatrixInsight(res.insight);
    setSyncLog(log => [...log, `終始矩陣洞察: ${res.insight}`]);
    await saveInsightToFirestore(res.insight);
    await saveLogToFirestore(`終始矩陣洞察: ${res.insight}`);
  };

  // 自動化流程範例：跨平台同步 Boost.space 新任務到 Aitable
  useEffect(() => {
    if (!data.boostspace.length || !data.aitable.length) return;
    // 找出 Boost.space 中 Aitable 尚未有的任務
    const newTasks = data.boostspace.filter(
      b => !data.aitable.some(a => a.id === b.id)
    );
    if (newTasks.length > 0) {
      const aitableClient = new AitableClient("Tasks");
      aitableClient.createRecords(newTasks.map(item => ({ fields: item })))
        .then(res => {
          console.log("自動同步到 Aitable 成功:", res);
        })
        .catch(err => {
          console.error("自動同步到 Aitable 失敗:", err);
        });
    }
  }, [data.boostspace, data.aitable]);

  // 進階自動化策略：Aitable 任務同步回 Boost.space
  useEffect(() => {
    if (!data.aitable.length || !data.boostspace.length) return;
    // 找出 Aitable 中 Boost.space 尚未有的任務
    const newTasks = data.aitable.filter(
      a => !data.boostspace.some(b => b.id === a.id)
    );
    if (newTasks.length > 0) {
      const boostClient = new BoostspaceClient("tasks");
      boostClient.createItem && newTasks.forEach(async item => {
        try {
          const res = await boostClient.createItem(item);
          setSyncLog(log => [...log, `Aitable → Boost.space 同步成功: ${JSON.stringify(res)}`]);
        } catch (err) {
          setSyncLog(log => [...log, `Aitable → Boost.space 同步失敗: ${err}`]);
        }
      });
    }
  }, [data.aitable, data.boostspace]);

  // 合併多平台任務資料（範例：Boost.space 與 Aitable）
  const mergedTasks = [
    ...data.boostspace,
    ...data.aitable.filter(item => !data.boostspace.some(b => b.id === item.id))
  ];

  // 互動 UI：平台切換、手動同步按鈕
  const handleSync = async () => {
    setSyncLog(log => [...log, `手動同步：${new Date().toLocaleString()}`]);
    // 範例：手動同步 Boost.space 新任務到 Aitable
    const newTasks = data.boostspace.filter(
      b => !data.aitable.some(a => a.id === b.id)
    );
    if (newTasks.length > 0) {
      const aitableClient = new AitableClient("Tasks");
      try {
        const res = await aitableClient.createRecords(newTasks.map(item => ({ fields: item })));
        setSyncLog(log => [...log, `同步到 Aitable 成功: ${JSON.stringify(res)}`]);
      } catch (err) {
        setSyncLog(log => [...log, `同步到 Aitable 失敗: ${err}`]);
      }
    } else {
      setSyncLog(log => [...log, "無新任務可同步"]);
    }
  };

  // 進化環：定期分析日誌並自動發布優化神諭與智慧回饋
  useEffect(() => {
    const interval = setInterval(async () => {
      const logs = await fetchLogs();
      const recentLogs = logs.slice(-20); // 擴大分析範圍
      // 多維度指標
      const failCount = recentLogs.filter(l => l.log.includes("失敗")).length;
      const syncCount = recentLogs.filter(l => l.log.includes("同步")).length;
      const delayCount = recentLogs.filter(l => l.log.includes("延遲") || l.log.includes("timeout")).length;
      const interactCount = recentLogs.filter(l => l.log.includes("互動") || l.log.includes("詳情")).length;
      // 失敗率
      const failRate = syncCount > 0 ? failCount / syncCount : 0;
      // 智慧回饋：若失敗率高於 0.3 或延遲次數超過 2，則自動優化
      if (failRate >= 0.3 || delayCount >= 2) {
        const o = await OmniMind.issueOracle("自動優化", `偵測到失敗率${(failRate*100).toFixed(1)}%，延遲${delayCount}次，請自動優化相關流程`);
        setOracle(o);
        setSyncLog(log => [...log, `進化環自動發布神諭: ${o.id}`]);
        await saveOracleToFirestore(o);
        await saveLogToFirestore(`進化環自動發布神諭: ${o.id}`);
        // 神諭分派給 StraicoAgent，下層代理自動觸發
        try {
          await StraicoAgent.dispatchOracle(o);
          setSyncLog(log => [...log, `神諭已分派給 StraicoAgent: ${o.id}`]);
          await saveLogToFirestore(`神諭已分派給 StraicoAgent: ${o.id}`);
        } catch (err) {
          setSyncLog(log => [...log, `神諭分派失敗: ${err}`]);
          await saveLogToFirestore(`神諭分派失敗: ${err}`);
        }
        // 智慧回饋：記錄分析結果
        const insight = `進化環分析：失敗率${(failRate*100).toFixed(1)}%，延遲${delayCount}次，互動${interactCount}次`;
        setMatrixInsight(insight);
        await saveInsightToFirestore(insight);
      }
    }, 60000); // 每 60 秒分析一次
    return () => clearInterval(interval);
  }, []);

  // UI 展示優化：平台選擇、同步日誌
  return (
    <div className="flex flex-col h-screen items-center justify-start bg-gradient-to-r from-blue-500 to-purple-600 p-8 overflow-auto">
      <h1 className="text-5xl font-bold text-white mb-8">🚀 TailwindCSS OK!</h1>
      <div className="flex gap-4 mb-6">
        {Object.keys(data).map(platform => (
          <button
            key={platform}
            className={`px-4 py-2 rounded-lg font-bold ${selectedPlatform === platform ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}
            onClick={() => setSelectedPlatform(platform)}
          >
            {platform}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded-lg font-bold bg-green-500 text-white"
          onClick={handleSync}
        >
          手動同步 Boost.space → Aitable
        </button>
        <button
          className="px-4 py-2 rounded-lg font-bold bg-purple-500 text-white"
          onClick={requestStraicoSigil}
        >
          取得 Straico 符令
        </button>
        <button
          className="px-4 py-2 rounded-lg font-bold bg-pink-500 text-white"
          onClick={callGeminiViaStraico}
        >
          Gemini API（Straico 代理）
        </button>
        <button
          className="px-4 py-2 rounded-lg font-bold bg-indigo-500 text-white"
          onClick={handleIssueOracle}
        >發布神諭（創元意志）</button>
        <button
          className="px-4 py-2 rounded-lg font-bold bg-cyan-500 text-white"
          onClick={handleQueryMatrix}
        >查詢終始矩陣（智慧層）</button>
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl mb-6">
        <h2 className="text-xl font-bold text-white mb-2">{selectedPlatform} 資料</h2>
        <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data[selectedPlatform as keyof typeof data], null, 2)}</pre>
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl mb-6">
        <h2 className="text-xl font-bold text-white mb-2">同步日誌</h2>
        <pre className="text-white text-xs max-h-48 overflow-auto">{syncLog.join("\n")}</pre>
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl mb-6">
        <h2 className="text-xl font-bold text-white mb-2">同步衝突提示</h2>
        {conflicts.length === 0 ? (
          <span className="text-green-300">目前無衝突</span>
        ) : (
          <ul>
            {conflicts.map((group, idx) => (
              <li key={idx} className="text-red-300 text-xs mb-2">
                衝突任務 id: {group[0].id}，內容：{group.map(t => t.name || t.title).join(" / ")}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl mb-6">
        {oracle && (
          <div className="mb-2 text-white text-xs">最新神諭：{oracle.content}（{oracle.strategy}）</div>
        )}
        {matrixInsight && (
          <div className="mb-2 text-white text-xs">終始矩陣洞察：{matrixInsight}</div>
        )}
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl mb-6">
        <button
          className="px-4 py-2 rounded-lg font-bold bg-yellow-500 text-white"
          onClick={batchSync}
        >批次同步 Boost.space → Aitable</button>
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-white mb-2">合併任務（Boost.space + Aitable）</h2>
        <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(mergedTasks, null, 2)}</pre>
      </div>
      <div className="bg-white/10 rounded-lg p-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-white mb-2">合併任務互動列表</h2>
        <TaskList tasks={mergedTasks} onDetail={task => { setModalTask(task); setModalOpen(true); }} />
      </div>
      <TaskDetailModal open={modalOpen} onClose={() => setModalOpen(false)} task={modalTask} />
    </div>
  );
}
