import { useEffect, useState } from "react";
import { AitableClient } from "../app/aitApiClient";
import { BoostspaceClient } from "../app/boostspaceClient";
import { CapacitiesClient } from "../app/capacitiesClient";
import { GithubClient } from "../app/githubClient";
import { JulesClient } from "../app/julesClient";
import { StraicoClient } from "../app/straicoClient";
import { FirebaseClient } from "../app/firebaseClient";
import { InfoflowClient } from "../app/infoflowClient";
import { VSCodeClient } from "../app/vscodeClient";

// 通用同步引擎：syncEngine
function useSyncEngine(platformData: Record<string, any>, onSyncLog: (msg: string) => void) {
  const [conflicts, setConflicts] = useState<any[]>([]);
  useEffect(() => {
    // 只取 array 型資料平台
    const allTasks = [
      ...(platformData.boostspace || []),
      ...(platformData.aitable || []),
      ...(platformData.capacities || []),
      ...(platformData.straico || []),
      ...(platformData.firebase || []),
      ...(platformData.infoflow || []),
      // 其他平台可擴充
    ];
    // id 重複偵測
    const idMap: Record<string, any[]> = {};
    allTasks.forEach(task => {
      if (!task.id) return;
      if (!idMap[task.id]) idMap[task.id] = [];
      idMap[task.id].push(task);
    });
    // 衝突：同 id 但 name/title 不同
    const conflictList = Object.values(idMap).filter(arr => arr.length > 1 && new Set(arr.map(t => t.name || t.title)).size > 1);
    setConflicts(conflictList);
  }, [platformData]);

  // 批次同步範例（Boost.space → Aitable）
  const batchSync = async () => {
    const newTasks = (platformData.boostspace || []).filter(
      b => !(platformData.aitable || []).some(a => a.id === b.id)
    );
    if (newTasks.length > 0) {
      const aitableClient = new AitableClient("Tasks");
      try {
        const res = await aitableClient.createRecords(newTasks.map(item => ({ fields: item })));
        onSyncLog(`批次同步到 Aitable 成功: ${JSON.stringify(res)}`);
      } catch (err) {
        onSyncLog(`批次同步到 Aitable 失敗: ${err}`);
      }
    } else {
      onSyncLog("無新任務可批次同步");
    }
  };

  return { conflicts, batchSync };
}

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

  const { conflicts, batchSync } = useSyncEngine(data, msg => setSyncLog(log => [...log, msg]));

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
        <ul>
          {mergedTasks.map((task, idx) => (
            <li key={task.id || idx} className="flex items-center justify-between py-2 border-b border-white/20">
              <span className="text-white text-sm">{task.name || task.title || JSON.stringify(task)}</span>
              <button
                className="ml-4 px-2 py-1 rounded bg-blue-500 text-white text-xs"
                onClick={() => alert(`任務詳情：${JSON.stringify(task, null, 2)}`)}
              >詳情</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
