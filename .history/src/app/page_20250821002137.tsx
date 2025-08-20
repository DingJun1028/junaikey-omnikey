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

  // 合併多平台任務資料（範例：Boost.space 與 Aitable）
  const mergedTasks = [
    ...data.boostspace,
    ...data.aitable.filter(item => !data.boostspace.some(b => b.id === item.id))
  ];

  // UI 展示優化：分平台區塊顯示
  return (
    <div className="flex flex-col h-screen items-center justify-start bg-gradient-to-r from-blue-500 to-purple-600 p-8 overflow-auto">
      <h1 className="text-5xl font-bold text-white mb-8">🚀 TailwindCSS OK!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Boost.space</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.boostspace, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Aitable</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.aitable, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Capacities</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.capacities, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Github</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.github, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Jules</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.jules, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Straico</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.straico, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Firebase</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.firebase, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">Infoflow</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.infoflow, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-2">VSCode</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(data.vscode, null, 2)}</pre>
        </div>
        <div className="bg-white/10 rounded-lg p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold text-white mb-2">合併任務（Boost.space + Aitable）</h2>
          <pre className="text-white text-xs max-h-48 overflow-auto">{JSON.stringify(mergedTasks, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
