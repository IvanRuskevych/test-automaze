import { gql } from '@apollo/client';

// -----------------------------
// Queries
// -----------------------------

export const GET_TASK = gql`
  query GetTask($taskId: ID!) {
    getTask(taskId: $taskId) {
      id
      title
      description
      priority
      isDone
      category {
        id
        name
      }
    }
  }
`;

export const GET_TASKS = gql`
  query Query {
    getTasks {
      id
      title
      description
      priority
      isDone
      category {
        name
        id
      }
    }
  }
`;

export const GET_TASKS_WITH_VALUES = gql`
  query GetTasks($take: Int, $skip: Int, $orderBy: OrderByInput, $filter: TaskFilterInput) {
    getTasks(take: $take, skip: $skip, orderBy: $orderBy, filter: $filter) {
      id
      title
      description
      priority
      isDone
      category {
        id
        name
      }
    }
  }
`;
