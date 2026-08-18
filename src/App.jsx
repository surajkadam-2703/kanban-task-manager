import React from "react";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskModal } from "./components/TaskModal";
import { useTasks } from "./hooks/useTasks";
import { PRIORITY } from "./constants";

function App() {
  const {
    tasksByColumn,
    filteredTasksByColumn,
    allTasksFlat,
    priorityFilter,
    searchQuery,
    setPriorityFilter,
    setSearchQuery,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderWithinColumn,
  } = useTasks();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("create"); // "create" | "edit"
  const [editingTask, setEditingTask] = React.useState(null);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode("edit");
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmitTask = (data) => {
    if (modalMode === "edit" && editingTask) {
      updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      });
    } else {
      createTask(data);
    }
    closeModal();
  };

  const handleDeleteTask = (task) => {
    deleteTask(task.id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0,_#020617_45%,_#000_100%)] px-3 py-4 md:px-8 md:py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-kanban-primary/80 via-kanban-accent/80 to-kanban-primarySoft/90 shadow-glow">
              <span className="text-sm font-black text-white">KB</span>
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 mix-blend-soft-light" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-50 md:text-lg">
                Kanban Task Manager
              </h1>
              <p className="text-[11px] text-slate-400 md:text-xs">
                Drag-and-drop tasks, filter by priority, search instantly, and keep everything in
                sync with local storage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-[11px] text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Local-first
            </div>
            <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-[11px] text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              DnD powered
            </div>
            <button
              data-testid="add-task-button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-kanban-primary to-kanban-accent px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:from-kanban-primarySoft hover:to-kanban-accent"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-sm">
                +
              </span>
              New task
            </button>
          </div>
        </header>

        <section className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-lg shadow-black/30">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-full max-w-sm">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Search tasks
                </label>
                <div className="relative">
                  <input
                    data-testid="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or description…"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-9 py-2 text-xs text-slate-100 outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/50"
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    🔍
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="w-40">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Priority filter
                </label>
                <select
                  data-testid="priority-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/50"
                >
                  <option value="all">All priorities</option>
                  <option value={PRIORITY.LOW}>Low</option>
                  <option value={PRIORITY.MEDIUM}>Medium</option>
                  <option value={PRIORITY.HIGH}>High</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <main className="flex flex-1 flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-xl shadow-black/40">
          <KanbanBoard
            tasksByColumn={tasksByColumn}
            filteredTasksByColumn={filteredTasksByColumn}
            allTasksFlat={allTasksFlat}
            onMoveTask={moveTask}
            onReorderWithinColumn={reorderWithinColumn}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={editingTask}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}

export default App;