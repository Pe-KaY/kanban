export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  title: string;
  description: string;
  subtasks: Subtask[];
  status: string; // e.g., 'todo', 'in-progress', etc.
}

export interface Column {
  name: string;
  tasks: Task[];
}

export interface Board {
  name: string;
  isActive: boolean;
  columns: Column[];
}

export interface KanbanState {
  boards: Board[];
}
