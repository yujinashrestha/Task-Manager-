export interface Task {
  id: number;
  title: string;
  description?: string;
  tag?: string;
}

export interface ColumnData {
  id: number;
  name: string;
  slug: string;
  tasks: Task[];
}

export interface TaskPayload {
  title: string;
  description: string;
  tag: string;
}

export interface AddTaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  onCancel: () => void;
  initialValues?: TaskFormData;
  submitLabel?: string;
}

export interface TaskUpdate {
  title: string;
  description: string;
  tag: string;
}

export interface TaskCardProps {
  task: Task;
  index: number;
  columnId: number | string;
  onDelete: () => void;
  onEdit: (updates: TaskUpdate) => void;
  moveCard: (
    dragColumnId: number | string,
    dragIndex: number,
    hoverColumnId: number | string,
    hoverIndex: number
  ) => void;
  completed?: boolean;
}

export interface DragItem {
  id: number | string;
  index: number;
  columnId: number | string;
  type: "TASK";
}





export interface TaskFormData {
  title: string;
  description: string;
  tag: string;
}



export interface ColumnProps {
  column: ColumnData;
  onAddTask: (columnId: number | string, payload: TaskFormData) => void;
  onDeleteTask: (taskId: number | string) => void;
  onEditTask: (taskId: number | string, updates: TaskFormData) => void;
  moveCard: (
    dragColumnId: number | string,
    dragIndex: number,
    hoverColumnId: number | string,
    hoverIndex: number
  ) => void;
}