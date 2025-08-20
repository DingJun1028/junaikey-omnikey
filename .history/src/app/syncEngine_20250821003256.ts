import { useEffect, useState } from "react";

export interface SyncEngineOptions {
  platforms: string[];
  conflictKeys?: string[]; // 預設 id, name, title
}

export function useSyncEngine(
  platformData: Record<string, any>,
  onSyncLog: (msg: string) => void,
  options?: SyncEngineOptions
) {
  const [conflicts, setConflicts] = useState<any[]>([]);
  const platforms = options?.platforms || [
    "boostspace",
    "aitable",
    "capacities",
    "straico",
    "firebase",
    "infoflow",
  ];
  const conflictKeys = options?.conflictKeys || ["id", "name", "title"];

  useEffect(() => {
    // 只取 array 型資料平台
    const allTasks = platforms.flatMap(p => platformData[p] || []);
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
  }, [platformData, platforms, conflictKeys]);

  // 批次同步範例（Boost.space → Aitable）
  const batchSync = async () => {
    const newTasks = (platformData.boostspace || []).filter(
      b => !(platformData.aitable || []).some(a => a.id === b.id)
    );
    if (newTasks.length > 0) {
      // 動態載入 client，減少耦合
      const { AitableClient } = await import("./aitApiClient");
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