import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { type FC, useEffect } from 'react';
import { useCategoryStore } from '~/store/category.store';
import type { Category } from '~/types/category.type.ts';

type Props = {
  value?: string | null;
  onChange: (v: string | null) => void;
  label?: string;
};

export const CategorySelector: FC<Props> = ({ value, onChange, label = 'Category' }) => {
  const { categories, loading, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories().then();
  }, [fetchCategories]);

  return (
    <FormControl
      size="medium"
      sx={{
        width: { xs: '100%', sm: 160 },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value ?? ''} label={label} onChange={(e) => onChange(e.target.value || null)} disabled={loading}>
        <MenuItem value="">None</MenuItem>
        {categories.map((c: Category) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
      {loading && (
        <CircularProgress size={20} sx={{ position: 'absolute', top: '50%', right: 8, marginTop: '-10px' }} />
      )}
    </FormControl>
  );
};
