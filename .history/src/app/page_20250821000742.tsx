import { useEffect } from "react";
import { AitableClient } from "../app/aitApiClient";
import { BoostspaceClient } from "../app/boostspaceClient";
import { CapacitiesClient } from "../app/capacitiesClient";
import { GithubClient } from "../app/githubClient";
import { JulesClient } from "../app/julesClient";
import { StraicoClient } from "../app/straicoClient";

export default function Home() {
  useEffect(() => {
    const boostClient = new BoostspaceClient("tasks"); // 請依實際 module 名稱
    boostClient.getItems()
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
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">🚀 TailwindCSS OK!</h1>
    </div>
  );
}
