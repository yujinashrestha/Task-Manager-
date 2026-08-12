import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier } from "dnd-core";
import AddTaskForm from "./AddTaskForm";
import type { TaskCardProps, DragItem} from "../types/types";

const TAG_STYLES: Record<string, string> = {
  design: "bg-blue-50 text-blue-700",
  engineering: "bg-red-50 text-red-700",
};

export default function TaskCard({
  task,
  index,
  columnId,
  onDelete,
  onEdit,
  moveCard,
  completed = false,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "TASK",
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragColumnId = item.columnId;
      const hoverColumnId = columnId;

      if (dragColumnId === hoverColumnId && dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only same-column reorder needs the "which half of the card" check
      // -- crossing into a new column should move immediately on hover.
      if (dragColumnId === hoverColumnId) {
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      }

      moveCard(dragColumnId, dragIndex, hoverColumnId, hoverIndex);

      // Mutate the dragged item in place so subsequent hover events use the
      // task's new position instead of stale coordinates.
      item.index = hoverIndex;
      item.columnId = hoverColumnId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: (): DragItem => ({ id: task.id, index, columnId, type: "TASK" }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    canDrag: !isEditing,
  });

  drag(drop(ref));

  const tagKey = task.tag?.toLowerCase() ?? "";
  const tagClass = TAG_STYLES[tagKey] ?? "bg-violet-100 text-violet-800";

  if (isEditing) {
    return (
      <AddTaskForm
        initialValues={{
          title: task.title,
          description: task.description ?? "",
          tag: task.tag ?? "",
        }}
        submitLabel="Save"
        onCancel={() => setIsEditing(false)}
        onSubmit={(updates) => {
          onEdit(updates);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`group rounded-lg bg-white px-3.5 py-3 shadow-sm cursor-grab ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`m-0 text-sm font-medium ${
            completed ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        <div className="flex items-center gap-1.5">
          {completed && (
            <i className="ti ti-circle-check text-lg text-green-500" aria-hidden="true" />
          )}

          <button
            type="button"
            className="border-none bg-transparent h-8 w-5 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-indigo-600"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M505 122.9L517.1 135C526.5 144.4 526.5 159.6 517.1 168.9L488 198.1L441.9 152L471 122.9C480.4 113.5 495.6 113.5 504.9 122.9zM273.8 320.2L408 185.9L454.1 232L319.8 366.2C316.9 369.1 313.3 371.2 309.4 372.3L250.9 389L267.6 330.5C268.7 326.6 270.8 323 273.7 320.1zM437.1 89L239.8 286.2C231.1 294.9 224.8 305.6 221.5 317.3L192.9 417.3C190.5 425.7 192.8 434.7 199 440.9C205.2 447.1 214.2 449.4 222.6 447L322.6 418.4C334.4 415 345.1 408.7 353.7 400.1L551 202.9C579.1 174.8 579.1 129.2 551 101.1L538.9 89C510.8 60.9 465.2 60.9 437.1 89zM152 128C103.4 128 64 167.4 64 216L64 488C64 536.6 103.4 576 152 576L424 576C472.6 576 512 536.6 512 488L512 376C512 362.7 501.3 352 488 352C474.7 352 464 362.7 464 376L464 488C464 510.1 446.1 528 424 528L152 528C129.9 528 112 510.1 112 488L112 216C112 193.9 129.9 176 152 176L264 176C277.3 176 288 165.3 288 152C288 138.7 277.3 128 264 128L152 128z" />
            </svg>
          </button>

          <button
            type="button"
            className="border-none bg-transparent text-base leading-none h-8 w-5 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-600"
            onClick={onDelete}
            aria-label="Delete task"
          >
            ×
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`mt-1.5 mb-2 text-[13px] ${completed ? "text-gray-300" : "text-gray-500"}`}>
          {task.description}
        </p>
      )}

      {task.tag && !completed && (
        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] ${tagClass}`}>
          {task.tag}
        </span>
      )}
    </div>
  );
}