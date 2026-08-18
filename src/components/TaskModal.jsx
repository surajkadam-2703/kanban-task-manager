import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PRIORITY, PRIORITY_LABELS } from "../constants";

export function TaskModal({ isOpen, mode, initialData, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: PRIORITY.MEDIUM,
      dueDate: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title || "",
          description: initialData.description || "",
          priority: initialData.priority || PRIORITY.MEDIUM,
          dueDate: initialData.dueDate ? initialData.dueDate.substring(0, 10) : "",
        });
      } else {
        reset({
          title: "",
          description: "",
          priority: PRIORITY.MEDIUM,
          dueDate: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const titleText = mode === "edit" ? "Edit task" : "Create new task";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900/90 p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            {titleText}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-700"
          >
            Esc
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Title
            </label>
            <input
              data-testid="task-title-input"
              type="text"
              placeholder="e.g., Implement drag and drop"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/50"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Description
            </label>
            <textarea
              data-testid="task-description-input"
              rows={3}
              placeholder="Add more context for this task"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/50"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Priority
              </label>
              <select
                data-testid="task-priority-select"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/50"
                {...register("priority", { required: true })}
              >
                <option value={PRIORITY.LOW}>{PRIORITY_LABELS[PRIORITY.LOW]}</option>
                <option value={PRIORITY.MEDIUM}>{PRIORITY_LABELS[PRIORITY.MEDIUM]}</option>
                <option value={PRIORITY.HIGH}>{PRIORITY_LABELS[PRIORITY.HIGH]}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Due date
              </label>
              <input
                data-testid="task-duedate-input"
                type="date"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/50"
                {...register("dueDate", {
                  validate: (value) => {
                    if (!value) return true;
                    const d = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (d < today) return "Due date must be today or in the future";
                    return true;
                  },
                })}
              />
              {errors.dueDate && (
                <p className="mt-1 text-xs text-red-400">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              data-testid="task-submit-button"
              disabled={isSubmitting}
              type="submit"
              className="rounded-lg bg-gradient-to-r from-kanban-primary to-kanban-accent px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:from-kanban-primarySoft hover:to-kanban-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mode === "edit" ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}