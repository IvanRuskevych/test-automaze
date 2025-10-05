import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      tasks {
        id
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query Query($categoryId: ID!) {
    getCategory(categoryId: $categoryId) {
      name
      id
    }
  }
`;
