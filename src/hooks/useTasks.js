import { useCallback, useMemo, useState } from "react";
import { useLocalStorageTasks } from "./useLocalStorage";
import { COLUMN_IDS, PRIORITY } from "../constants";

const createInitialTasks = () => ({
  [COLUMN_IDS.TODO]: [
    {
      id: "t1",
      title: "Design data model",
      description: "Define task schema, columns, and drag-and-drop strategy.",
      priority: PRIORITY.HIGH,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "t2",
      title: "Setup Vite + Tailwind",
      description: "Initialize project, configure Tailwind, and create base layout.",
      priority: PRIORITY.MEDIUM,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
  [COLUMN_IDS.IN_PROGRESS]: [
    {
      id: "t3",
      title: "Implement drag & drop",
      description: "Integrate @dnd-kit for smooth drag-and-drop interactions.",
      priority: PRIORITY.HIGH,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
  [COLUMN_IDS.DONE]: [],
});

export function useTasks() {
  const [tasksByColumn, setTasksByColumn] = useLocalStorageTasks(createInitialTasks());
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allTasksFlat = useMemo(
    () =>
      Object.entries(tasksByColumn).flatMap(([columnId, tasks]) =>
        tasks.map((task) => ({ ...task, columnId }))
      ),
    [tasksByColumn]
  );

  const moveTask = useCallback((taskId, fromColumnId, toColumnId, index = null) => {
    if (fromColumnId === toColumnId) return;

    setTasksByColumn((prev) => {
      const sourceTasks = [...prev[fromColumnId]];
      const taskIndex = sourceTasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const [task] = sourceTasks.splice(taskIndex, 1);
      const destTasks = [...prev[toColumnId]];

      if (index === null || index >= destTasks.length) {
        destTasks.push(task);
      } else {
        destTasks.splice(index, 0, task);
      }

      return {
        ...prev,
        [fromColumnId]: sourceTasks,
        [toColumnId]: destTasks,
      };
    });
  }, [setTasksByColumn]);

  const reorderWithinColumn = useCallback((columnId, activeId, overId) => {
    if (!overId || activeId === overId) return;
    setTasksByColumn((prev) => {
      const columnTasks = [...prev[columnId]];
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const [moved] = columnTasks.splice(oldIndex, 1);
      columnTasks.splice(newIndex, 0, moved);

      return { ...prev, [columnId]: columnTasks };
    });
  }, [setTasksByColumn]);

  const createTask = useCallback((data) => {
    const id = Date.now().toString();
    const newTask = {
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
    };

    setTasksByColumn((prev) => ({
      ...prev,
      [COLUMN_IDS.TODO]: [newTask, ...prev[COLUMN_IDS.TODO]],
    }));

    return newTask;
  }, [setTasksByColumn]);

  const updateTask = useCallback((taskId, updates) => {
    setTasksByColumn((prev) => {
      const newState = { ...prev };
      for (const columnId of Object.keys(newState)) {
        newState[columnId] = newState[columnId].map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
      }
      return newState;
    });
  }, [setTasksByColumn]);

  const deleteTask = useCallback((taskId) => {
    setTasksByColumn((prev) => {
      const newState = { ...prev };
      for (const columnId of Object.keys(newState)) {
        newState[columnId] = newState[columnId].filter((task) => task.id !== taskId);
      }
      return newState;
    });
  }, [setTasksByColumn]);

  const filteredTasksByColumn = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const priority = priorityFilter;

    const matchesFilters = (task) => {
      const matchesPriority = priority === "all" || task.priority === priority;
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      return matchesPriority && matchesSearch;
    };

    return Object.fromEntries(
      Object.entries(tasksByColumn).map(([columnId, tasks]) => [
        columnId,
        tasks.filter(matchesFilters),
      ])
    );
  }, [tasksByColumn, priorityFilter, searchQuery]);

  return {
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
  };
}