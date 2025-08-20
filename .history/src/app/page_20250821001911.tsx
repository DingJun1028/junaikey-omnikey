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

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">🚀 TailwindCSS OK!</h1>
      {/* 範例：顯示部分 API 資料 */}
      <pre className="text-white text-xs mt-8 max-h-96 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
