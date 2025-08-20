import { AitableClient } from "./aitApiClient";

export default function Home() {
  // 你可以在 main.py 或 TypeScript 入口檔案中初始化 AitableClient 並使用
  // 例如：
  // const client = new AitableClient("Tasks");
  // client.getRecords().then(console.log);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">🚀 TailwindCSS OK!</h1>
    </div>
  );
}
