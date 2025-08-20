// src/app/components/TaskDetailModal.tsx
import React from "react";

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: any;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ open, onClose, task }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">任務詳情</h2>
        <pre className="text-xs mb-4">{JSON.stringify(task, null, 2)}</pre>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
          onClick={onClose}
        >關閉</button>
      </div>
    </div>
  );
};