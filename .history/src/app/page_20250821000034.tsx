import { AitableClient } from "./aitApiClient";

export default function Home() {
  // JunAiKey 集成範例
  const client = new AitableClient("Tasks");
  client.getRecords().then(console.log).catch(console.error);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white">🚀 TailwindCSS OK!</h1>
    </div>
  );
}
