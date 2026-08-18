// src/components/TaskCard.jsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { formatDueDate } from "../utils/dateUtils";
import { PRIORITY_LABELS, PRIORITY } from "../constants";

function priorityColor(priority) {
  switch (priority) {
    case PRIORITY.HIGH:
      return "bg-rose-500/10 text-rose-300 border-rose-500/40";
    case PRIORITY.MEDIUM:
      return "bg-amber-400/10 text-amber-300 border-amber-400/40";
    case PRIORITY.LOW:
    default:
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/40";
  }
}

export function TaskCard({ task, onEdit, onDelete, dragOverlay = false }) {
  const draggable = useDraggable({
    id: task.id,
    data: {
      columnId: task.columnId,
    },
  });

  const isOverlay = dragOverlay;

  const { attributes, listeners, setNodeRef, transform, isDragging } = isOverlay
    ? { attributes: {}, listeners: {}, setNodeRef: () => {}, transform: null, isDragging: false }
    : draggable;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`task-card-${task.id}`}
      className={`group relative rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/90 to-slate-950/90 p-4 shadow-lg shadow-black/30 transition-all hover:border-kanban-primary/80 hover:shadow-glow
        ${
          isOverlay
            ? "pointer-events-none ring-2 ring-kanban-primary/80 shadow-glow"
            : ""
        }
        ${
          isDragging && !isOverlay
            ? "opacity-0 pointer-events-none"
            : ""
        }`}
      {...(!isOverlay ? attributes : {})}
      {...(!isOverlay ? listeners : {})}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            {task.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-xs text-slate-400">
            {task.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityColor(
              task.priority
            )}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="mt-1 text-[11px] text-slate-500">
            {formatDueDate(task.dueDate)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-kanban-primary/40 to-kanban-accent/40 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-[9px] font-semibold text-slate-200">
              {task.title
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </div>
          <span>Created</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            data-testid="edit-task-button"
            onClick={onEdit}
            className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-200 transition hover:border-kanban-primary hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            data-testid="delete-task-button"
            onClick={onDelete}
            className="rounded-full border border-rose-700/70 bg-rose-950/40 px-2 py-1 text-[10px] font-medium text-rose-200 transition hover:border-rose-500 hover:bg-rose-900/80"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-kanban-primary/10 via-transparent to-kanban-accent/10 opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
    </div>
  );
}