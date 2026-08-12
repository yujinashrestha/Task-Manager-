import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Column from "../components/Column";
import type { ColumnData, TaskPayload } from "../types/types";
import AddTaskForm from "../components/AddTaskForm";

const initialColumns: ColumnData[] = [
  {
    id: 1,
    name: "To Do",
    slug: "todo",
    tasks: [
      { id: 1, title: "Learn React", description: "Learn useState and useEffect", tag: "React" },
    ],
  },
  { id: 2, name: "In Progress", slug: "in_progress", tasks: [] },
  { id: 3, name: "In Review", slug: "in_review", tasks: [] },
  { id: 4, name: "Completed", slug: "completed", tasks: [] },
];

export default function TaskBoard() {
  const [isAdding, setIsAdding] = useState(false);

  const [columns, setColumns] = useState<ColumnData[]>(() => {
    const savedColumns = localStorage.getItem("task-board");
    if (savedColumns) return JSON.parse(savedColumns);
    return initialColumns;
  });

  useEffect(() => {
    localStorage.setItem("task-board", JSON.stringify(columns));
  }, [columns]);

  const handleEditTask = (taskId: number | string, updates: TaskPayload) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
      }))
    );
  };

  // Handles both same-column reordering and cross-column moves.
  // dragIndex/hoverIndex are positions within their respective columns'
  // tasks arrays at the moment the hover/drop fired.
  const moveCard = (
    dragColumnId: number | string,
    dragIndex: number,
    hoverColumnId: number | string,
    hoverIndex: number
  ) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((c) => ({ ...c, tasks: [...c.tasks] }));

      const sourceColumn = newColumns.find((c) => c.id === dragColumnId);
      const destColumn = newColumns.find((c) => c.id === hoverColumnId);
      if (!sourceColumn || !destColumn) return prevColumns;

      const [draggedTask] = sourceColumn.tasks.splice(dragIndex, 1);
      if (!draggedTask) return prevColumns;

      destColumn.tasks.splice(hoverIndex, 0, draggedTask);

      return newColumns;
    });
  };

  const handleAddTask = (columnId: number | string, payload: TaskPayload) => {
    const newTask = { id: Date.now(), ...payload };
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column
      )
    );
  };

  const handleDeleteTask = (taskId: number | string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }))
    );
  };

  const handleQuickAdd = () => {
    setIsAdding(true);
  };

  const handleSubmitNewTask = (payload: TaskPayload) => {
    const firstColumnId = columns[0]?.id;
    if (firstColumnId === undefined) return;
    handleAddTask(firstColumnId, payload);
    setIsAdding(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-black">Task Manager</h2>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
              <i className="ti ti-user" aria-hidden="true" />
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="mb-5 text-sm text-indigo-600">Track tasks from start to completion</p>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <span className="text-base leading-none">+</span>
            Add New Task
          </button>

          {isAdding && (
            <AddTaskForm onSubmit={handleSubmitNewTask} onCancel={() => setIsAdding(false)} />
          )}

          <div className="board flex w-full flex-col items-stretch gap-4 overflow-x-hidden md:flex-row md:items-start md:overflow-x-auto min-h-[400px] md:min-h-[600px]">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                moveCard={moveCard}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}