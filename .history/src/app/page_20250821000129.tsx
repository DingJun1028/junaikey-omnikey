import { useEffect } from "react";
import { AitableClient } from "./aitApiClient";

export default function Home() {
  useEffect(() => {
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
