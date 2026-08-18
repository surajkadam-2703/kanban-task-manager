// src/components/KanbanBoard.jsx
import React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { COLUMN_IDS } from "../constants";

function KanbanDragOverlay({ activeTask }) {
  const { active, activatorEvent, activeNodeRect } = useDndContext();

  if (!active || !activeTask) return null;

  // Lock overlay size to the original card’s bounding box
  const overlayStyle = {
    width: activeNodeRect?.width,
    height: activeNodeRect?.height,
    transformOrigin: "0 0",
  };

  return (
    <DragOverlay
      // Do NOT rescale; keep original size
      adjustScale={false}
      style={overlayStyle}
    >
      <TaskCard
        task={activeTask}
        onEdit={() => {}}
        onDelete={() => {}}
        dragOverlay={true}
      />
    </DragOverlay>
  );
}

export function KanbanBoard({
  tasksByColumn,
  filteredTasksByColumn,
  allTasksFlat,
  onMoveTask,
  onReorderWithinColumn,
  onEditTask,
  onDeleteTask,
}) {
  const [activeTaskId, setActiveTaskId] = React.useState(null);

  const activeTask = React.useMemo(
    () => allTasksFlat.find((t) => t.id === activeTaskId) || null,
    [activeTaskId, allTasksFlat]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;
    if (active.id === over.id) return;

    const activeData = active.data.current || {};
    const overData = over.data.current || {};

    const fromColumnId = activeData.columnId;
    const toColumnId = overData.columnId;

    if (!fromColumnId || !toColumnId) return;

    if (fromColumnId === toColumnId) {
      onReorderWithinColumn(fromColumnId, active.id, over.id);
    } else {
      const destTasks = filteredTasksByColumn[toColumnId];
      const overIndex = destTasks.findIndex((t) => t.id === over.id);
      const index = overIndex === -1 ? null : overIndex;
      onMoveTask(active.id, fromColumnId, toColumnId, index);
    }
  };

  const columns = [
    {
      id: COLUMN_IDS.TODO,
      title: "To Do",
      dataTestId: "column-todo",
      counterTestId: "column-counter-todo",
    },
    {
      id: COLUMN_IDS.IN_PROGRESS,
      title: "In Progress",
      dataTestId: "column-in-progress",
      counterTestId: "column-counter-in-progress",
    },
    {
      id: COLUMN_IDS.DONE,
      title: "Done",
      dataTestId: "column-done",
      counterTestId: "column-counter-done",
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((col) => {
          const allColumnTasks = tasksByColumn[col.id] || [];
          const filteredColumnTasks = filteredTasksByColumn[col.id] || [];

          const items = filteredColumnTasks.map((t) => t.id);

          return (
            <SortableContext
              key={col.id}
              id={col.id}
              items={items}
              strategy={rectSortingStrategy}
            >
              <Column
                id={col.id}
                title={col.title}
                tasks={filteredColumnTasks.map((task) => ({
                  ...task,
                  columnId: col.id,
                }))}
                totalCount={allColumnTasks.length}
                dataTestId={col.dataTestId}
                counterTestId={col.counterTestId}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </SortableContext>
          );
        })}
      </div>

      {typeof document !== "undefined" &&
        createPortal(<KanbanDragOverlay activeTask={activeTask} />, document.body)}
    </DndContext>
  );
}