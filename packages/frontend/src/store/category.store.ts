import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { categoryService } from '~/service';
import type { CategoryFormValues, CategoryStore } from '~/types/category.type.ts';
import { handleApolloError } from '~/utils/apolloError.ts';
import { notifySuccess } from '~/utils/notify.ts';

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,
      fieldErrors: null,

      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { data } = await categoryService.getCategories();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          set({ categories: data.getCategories });
        } catch (err) {
          const { fieldErrors, error } = handleApolloError(err);
          set({ fieldErrors, error });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      createCategory: async (payload: CategoryFormValues) => {
        set({ loading: true, error: null });
        try {
          await categoryService.create(payload);
          await get().fetchCategories();
          notifySuccess('Category created');
          return { success: true };
        } catch (err) {
          const { fieldErrors, error } = handleApolloError(err);
          set({ fieldErrors, error });
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      updateCategory: async (categoryId, payload) => {
        set({ loading: true, error: null });
        try {
          await categoryService.update(categoryId, payload);
          await get().fetchCategories();
          notifySuccess('Category updated');
          return { success: true };
        } catch (err) {
          const { fieldErrors, error } = handleApolloError(err);
          set({ fieldErrors, error });
          return { success: false };
        } finally {
          set({ loading: false });
        }
      },

      deleteCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
          await categoryService.delete(categoryId);
          await get().fetchCategories();
          notifySuccess('Category deleted');
        } catch (err) {
          const { fieldErrors, error } = handleApolloError(err);
          set({ fieldErrors, error });
          throw err;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'category-storage',
      partialize: (state) => ({
        categories: state.categories,
      }),
    },
  ),
);
