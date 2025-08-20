import { useEffect } from "react";
import { AitableClient } from "../app/aitApiClient";
import { BoostspaceClient } from "../app/boostspaceClient";
import { CapacitiesClient } from "../app/capacitiesClient";
import { GithubClient } from "../app/githubClient";
import { JulesClient } from "../app/julesClient";
import { StraicoClient } from "../app/straicoClient";
import { FirebaseClient } from "../app/firebaseClient";
import { InfoflowClient } from "../app/infoflowClient";

export default function Home() {
  useEffect(() => {
    // Boost.space 雙向同步範例
    const boostClient = new BoostspaceClient("tasks");
    let isSyncing = false;
    const syncBoostSpace = async () => {
      if (isSyncing) return; // 防止無限迴圈
      isSyncing = true;
      try {
        const items = await boostClient.getItems();
        console.log("Boost.space 資料:", items);
        // 這裡可串接其他平台資料同步
        // 例如：將 Boost.space 資料同步到 Aitable
        // await client.createRecords(items.map(item => ({ fields: item })));
      } catch (err) {
        console.error(err);
      } finally {
        isSyncing = false;
      }
    };
    syncBoostSpace();

    const boostClientInstance = new BoostspaceClient("tasks"); // 請依實際 module 名稱
    boostClientInstance.getItems()
      .then(items => {
        console.log("Boost.space 資料:", items);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);

    const client = new AitableClient("Tasks");
    client.getRecords()
      .then(records => {
        console.log("Aitable 資料:", records);
        // 這裡可串接到狀態管理或 UI 顯示
      })
      .catch(console.error);

    // Capacities 串接
    const capClient = new CapacitiesClient("notes"); // 請依實際 resource 名稱
    capClient.getItems()
      .then(items => {
        console.log("Capacities 資料:", items);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);

    // Github 串接
    const ghClient = new GithubClient("owner/repo"); // 請依實際 repo 名稱
    ghClient.getRepoInfo()
      .then(info => {
        console.log("Github Repo 資料:", info);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);

    // Google Jules 串接
    const julesClient = new JulesClient();
    julesClient.generateContent("請用繁體中文介紹台灣的夜市文化")
      .then(text => {
        console.log("Google Jules 回應:", text);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);

    // Straico 串接
    const straicoClient = new StraicoClient("tasks"); // 請依實際 resource 名稱
    straicoClient.getItems()
      .then(items => {
        console.log("Straico 資料:", items);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);

    // Firebase 串接
    const firebaseClient = new FirebaseClient("tasks"); // 請依實際 collection 名稱
    firebaseClient.getDocuments()
      .then(docs => {
        console.log("Firebase 資料:", docs);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);

    // Infoflow 串接
    const infoflowClient = new InfoflowClient("tasks"); // 請依實際 resource 名稱
    infoflowClient.getItems()
      .then(items => {
        console.log("Infoflow 資料:", items);
        // 可串接 UI 或狀態管理
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">🚀 TailwindCSS OK!</h1>
    </div>
  );
}
