import { useEffect } from "react";
import { AitableClient } from "../app/aitApiClient";
import { BoostspaceClient } from "../app/boostspaceClient";

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
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">🚀 TailwindCSS OK!</h1>
    </div>
  );
}
