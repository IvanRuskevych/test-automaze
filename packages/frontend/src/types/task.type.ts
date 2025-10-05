import type { Category, UUID } from '~/types/category.type.ts';

export type Task = {
  id: UUID;
  title: string;
  description?: string | null;
  isDone: boolean;
  priority: number;
  category?: Category | null;
};

export type TaskFormValues = {
  title: string;
  description?: string;
  priority?: number;
  categoryId?: UUID | null;
};

export type TaskStatus = 'all' | 'done' | 'undone';
export type TaskPriorityOrder = 'asc' | 'desc';

export type TaskStore = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;

  fetchTasks: (params?: {
    take?: number;
    skip?: number;
    orderBy?: { field: string; direction: TaskPriorityOrder };
    filter?: {
      status?: TaskStatus;
      categoryId?: UUID;
      search?: string;
      priority?: { min?: number; max?: number };
    };
  }) => Promise<void>;
  createTask: (payload: TaskFormValues) => Promise<{ success: boolean }>;
  updateTask: (taskId: UUID, payload: Partial<TaskFormValues & { isDone?: boolean }>) => Promise<{ success: boolean }>;
  deleteTask: (taskId: UUID) => Promise<void>;

  getFiltered: (filter: { search?: string; categoryId?: UUID | null; onlyDone?: boolean }) => Task[];
  getSorted: (sort: { by: 'priority' | 'title' | 'description'; direction?: 'asc' | 'desc' }) => Task[];
};
