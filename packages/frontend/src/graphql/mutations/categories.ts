import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation Mutation($input: CategoryCreateInput) {
    createCategory(input: $input) {
      name
      id
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation Mutation($categoryId: ID!) {
    updateCategory(categoryId: $categoryId) {
      id
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation Mutation($categoryId: ID!) {
    deleteCategory(categoryId: $categoryId) {
      id
      name
    }
  }
`;
