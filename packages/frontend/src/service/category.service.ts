import { apolloClient } from '~/apollo/client';
import { CREATE_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from '~/graphql/mutations';
import { GET_CATEGORIES, GET_CATEGORY } from '~/graphql/queries';
import type { CategoryFormValues } from '~/types/category.type.ts';

export const categoryService = {
  getCategories: () =>
    apolloClient.query({
      query: GET_CATEGORIES,
      fetchPolicy: 'network-only',
    }),

  getCategory: (categoryId: string) => {
    return apolloClient.query({
      query: GET_CATEGORY,
      variables: { categoryId },
    });
  },

  create: (input: CategoryFormValues) =>
    apolloClient.mutate({
      mutation: CREATE_CATEGORY,
      variables: { input },
    }),

  update: (categoryId: string, input: Partial<CategoryFormValues>) =>
    apolloClient.mutate({
      mutation: UPDATE_CATEGORY,
      variables: { categoryId, input },
    }),

  delete: (categoryId: string) =>
    apolloClient.mutate({
      mutation: DELETE_CATEGORY,
      variables: { categoryId },
    }),
};
