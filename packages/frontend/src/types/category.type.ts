export type UUID = string;

export type Category = {
  id: UUID;
  name: string;
};

export type CategoryFormValues = {
  name: string;
};

export type CategoryStore = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;

  fetchCategories: () => Promise<void>;
  createCategory: (payload: CategoryFormValues) => Promise<{ success: boolean }>;
  updateCategory: (categoryId: UUID, payload: Partial<CategoryFormValues>) => Promise<{ success: boolean }>;
  deleteCategory: (categoryId: UUID) => Promise<void>;
};
