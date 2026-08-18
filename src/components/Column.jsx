import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

export function Column({
  id,
  title,
  tasks,
  totalCount,
  dataTestId,
  counterTestId,
  onEditTask,
  onDeleteTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      columnId: id,
    },
  });

  return (
    <section
      data-testid={dataTestId}
      className="flex h-full min-h-[260px] flex-1 flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/30"
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs text-slate-400 ring-1 ring-slate-700/80">
            {title[0]}
          </span>
          <h2 className="text-sm font-semibold text-slate-100">
            {title}
          </h2>
        </div>
        <span
          data-testid={counterTestId}
          className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 ring-1 ring-slate-700"
        >
          {totalCount}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/60 p-2 transition ${
          isOver ? "border-kanban-primary/80 bg-slate-900/80" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-6 text-center text-xs text-slate-500">
            Drop a task here or create a new one.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))
        )}
      </div>
    </section>
  );
}