import { useEffect, useState } from "react";
import { BlueClient } from "./blueClient";

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
    "blue",
  ];
  const conflictKeys = options?.conflictKeys || ["id", "name", "title"];

  // Initialize BlueClient (using public env vars for client-side)
  const blueClient = new BlueClient(
    process.env.NEXT_PUBLIC_BLUE_API_KEY || '',
    process.env.NEXT_PUBLIC_BLUE_COMPANY_ID || ''
  );

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

  // 批次同步 (Multi-platform Sync)
  const batchSync = async () => {
    const workspaceId = process.env.NEXT_PUBLIC_BLUE_WORKSPACE_ID || '';
    const newTasksForBlue = (platformData.boostspace || []).filter(
      b => !(platformData.blue || []).some((a: any) => a.id === b.id)
    );

    if (newTasksForBlue.length > 0) {
      onSyncLog(`🔄 正在同步 ${newTasksForBlue.length} 筆資料至 Blue.cc...`);
      try {
        for (const task of newTasksForBlue) {
          await blueClient.createRecord(workspaceId, 'cmp2eu2gi0ajopo01bxq8k8ib', task.name || task.title, task.description || '');
        }
        onSyncLog(`✅ 同步至 Blue.cc 成功`);
      } catch (err: any) {
        onSyncLog(`❌ 同步至 Blue.cc 失敗: ${err.message}`);
      }
    }

    // Existing Aitable Sync logic
    const newTasksForAitable = (platformData.boostspace || []).filter(
      b => !(platformData.aitable || []).some(a => a.id === b.id)
    );
    if (newTasksForAitable.length > 0) {
      const { AitableClient } = await import("./aitApiClient");
      const aitableClient = new AitableClient("Tasks");
      try {
        await aitableClient.createRecords(newTasksForAitable.map(item => ({ fields: item })));
        onSyncLog(`✅ 同步到 Aitable 成功`);
      } catch (err) {
        onSyncLog(`❌ 同步到 Aitable 失敗: ${err}`);
      }
    } else {
      onSyncLog("無新任務需同步至其他平台");
    }
  };

  return { conflicts, batchSync };
}
