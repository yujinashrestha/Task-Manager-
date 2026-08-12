import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import type { ColumnProps, DragItem} from "../types/types";



const DOT_COLORS: Record<string, string> = {
  todo: "bg-gray-500",
  in_progress: "bg-indigo-700",
  in_review: "bg-red-700",
  completed: "bg-green-600",
};

const EMPTY_LABELS: Record<string, string> = {
  in_review: "Nothing to review",
};

export default function Column({
  column,
  onAddTask,
  onDeleteTask,
  onEditTask,
  moveCard,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: "TASK",
    drop: (item, monitor) => {
      // A card already handled this via its own hover-reorder logic.
      if (monitor.didDrop()) return;
      // Card already lives in this column at some index -- nothing to do,
      // its position was set live by the last card it hovered over.
      if (item.columnId === column.id) return;

      // Task dragged from another column straight into empty space
      // (an empty column, or below the last card) -- append it here.
      moveCard(item.columnId, item.index, column.id, column.tasks.length);
      item.index = column.tasks.length;
      item.columnId = column.id;
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  }));

  const isEmpty = column.tasks.length === 0 && !isAdding;

  return (
    <div className="flex h-full w-full max-w-full flex-col rounded-lg bg-gray-200 p-3 md:w-[280px] md:max-w-[280px]">
      <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold tracking-wide">
        <span className={`h-2 w-2 rounded-full ${DOT_COLORS[column.slug] ?? "bg-gray-500"}`} />
        <span className="flex-1 text-gray-700">{column.name.toUpperCase()}</span>
        <span className="rounded-full bg-gray-300 px-2 py-0.5 text-xs text-gray-600">
          {column.tasks.length}
        </span>
        {column.name === "To Do" && (
          <button
            type="button"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-none bg-gray-300 text-[15px] leading-none text-gray-600 cursor-pointer hover:bg-gray-400"
            onClick={() => setIsAdding((value) => !value)}
            aria-label={`Add task to ${column.name}`}
          >
            +
          </button>
        )}
      </div>

      {isAdding && (
        <AddTaskForm
          onCancel={() => setIsAdding(false)}
          onSubmit={(payload) => {
            onAddTask(column.id, payload);
            setIsAdding(false);
          }}
        />
      )}

      <div
        ref={(node) => {
          drop(node);
        }}
        className={`flex min-h-[220px] flex-1 flex-col gap-2 rounded-lg transition-colors ${
          isOver ? "bg-indigo-100" : ""
        }`}
      >
        {isEmpty && (
         <div className="flex flex-1 flex-col items-center justify-center gap-2 min-h-[50px] rounded-lg border border-dashed border-gray-300 text-gray-400">
            <i className="ti ti-clipboard-text text-2xl" aria-hidden="true" />
            <span className="text-[13px]">{EMPTY_LABELS[column.slug] ?? "Nothing here"}</span>
          </div>
        )}

        {column.tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            completed={column.slug === "completed"}
            onDelete={() => onDeleteTask(task.id)}
            onEdit={(updates) => onEditTask(task.id, updates)}
            moveCard={moveCard}
          />
        ))}
      </div>
    </div>
  );
}