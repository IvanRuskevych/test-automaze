import { create } from 'zustand';
import { taskService } from '~/service';
import type { TaskFormValues, TaskStore } from '~/types/task.type.ts';
import { handleApolloError } from '~/utils/apolloError.ts';
import { notifyError, notifySuccess } from '~/utils/notify.ts';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  fieldErrors: null,

  fetchTasks: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data } = await taskService.getTasksWithVariables(params);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      set({ tasks: data.getTasks, loading: false });
    } catch (err) {
      const { fieldErrors, error } = handleApolloError(err);
      set({ fieldErrors, error });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getFiltered: ({ search, categoryId, onlyDone }) => {
    let tasks = get().tasks;
    if (search) {
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryId) {
      tasks = tasks.filter((t) => t.category?.id === categoryId);
    }
    if (onlyDone) {
      tasks = tasks.filter((t) => t.isDone);
    }
    return tasks;
  },

  createTask: async (payload: TaskFormValues) => {
    set({ loading: true, error: null });
    try {
      await taskService.create(payload);
      await get().fetchTasks();
      notifySuccess('Task created successfully');
      return { success: true };
    } catch (err) {
      const { fieldErrors, error } = handleApolloError(err);
      set({ fieldErrors, error });
      notifyError(`Task created failed: ${error}`);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (taskId, payload) => {
    set({ loading: true, error: null });
    try {
      await taskService.update(taskId, payload);
      await get().fetchTasks();
      notifySuccess('Task updated successfully');
      return { success: true };
    } catch (err) {
      const { fieldErrors, error } = handleApolloError(err);
      set({ fieldErrors, error });
      notifyError(`Task updated failed: ${error}`);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      await taskService.delete(taskId);
      await get().fetchTasks();
      notifySuccess('Task deleted');
    } catch (err) {
      const { fieldErrors, error } = handleApolloError(err);
      set({ fieldErrors, error });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getSorted: ({ by, direction = 'asc' }) => {
    const tasks = [...get().tasks];
    return tasks.sort((a, b) => {
      let compare = 0;
      if (by === 'priority') compare = a.priority - b.priority;
      if (by === 'title') compare = a.title.localeCompare(b.title);
      return direction === 'asc' ? compare : -compare;
    });
  },
}));
