import { gql } from '@apollo/client';

// -----------------------------
// Mutations
// -----------------------------
export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskCreateInput!) {
    createTask(input: $input) {
      id
      title
      description
      isDone
      priority
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($taskId: ID!, $input: TaskUpdateInput!) {
    updateTask(taskId: $taskId, input: $input) {
      id
      title
      description
      isDone
      priority
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      id
      title
    }
  }
`;
