import { apolloClient } from '~/apollo/client';
import { CREATE_TASK, DELETE_TASK, UPDATE_TASK } from '~/graphql/mutations/tasks';
import { GET_TASK, GET_TASKS, GET_TASKS_WITH_VALUES } from '~/graphql/queries/tasks';
import type { TaskFormValues, TaskPriorityOrder, TaskStatus, UUID } from '~/types/task.type.ts';

export const taskService = {
  getTasks: () => {
    return apolloClient.query({
      query: GET_TASKS,
      fetchPolicy: 'network-only',
    });
  },

  getTasksWithVariables: (variables?: {
    take?: number;
    skip?: number;
    orderBy?: { field: string; direction: TaskPriorityOrder };
    filter?: {
      status?: TaskStatus;
      categoryId?: UUID;
      search?: string;
      priority?: { min?: number; max?: number };
    };
  }) =>
    apolloClient.query({
      query: GET_TASKS_WITH_VALUES,
      variables,
      fetchPolicy: 'network-only',
    }),

  getTask: (taskId: string) => {
    return apolloClient.query({
      query: GET_TASK,
      variables: { taskId },
    });
  },

  create: (input: TaskFormValues) =>
    apolloClient.mutate({
      mutation: CREATE_TASK,
      variables: { input },
    }),

  update: (taskId: string, input: Partial<TaskFormValues & { isDone?: boolean }>) =>
    apolloClient.mutate({
      mutation: UPDATE_TASK,
      variables: { taskId, input },
    }),

  delete: (taskId: string) =>
    apolloClient.mutate({
      mutation: DELETE_TASK,
      variables: { taskId },
    }),
};
