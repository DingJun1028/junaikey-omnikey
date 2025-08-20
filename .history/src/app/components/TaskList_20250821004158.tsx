// src/app/components/TaskList.tsx
import React from "react";

interface TaskListProps {
  tasks: any[];
  onDetail: (task: any) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDetail }) => (
  <ul>
    {tasks.map((task, idx) => (
      <li key={task.id || idx} className="flex items-center justify-between py-2 border-b border-white/20">
        <span className="text-white text-sm">{task.name || task.title || JSON.stringify(task)}</span>
        <button
          className="ml-4 px-2 py-1 rounded bg-blue-500 text-white text-xs"
          onClick={() => onDetail(task)}
        >詳情</button>
      </li>
    ))}
  </ul>
);