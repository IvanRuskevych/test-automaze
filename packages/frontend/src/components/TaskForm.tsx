import { Button, Stack, TextField } from '@mui/material';
import { type FC, type FormEvent, useState } from 'react';
import { useTaskStore } from '~/store/task.store';

import { CategorySelector } from './CategorySelector';

export const TaskForm: FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const createTask = useTaskStore((s) => s.createTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(5);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    setSubmitting(true);
    const { success } = await createTask({ title, description, priority, categoryId });
    setSubmitting(false);
    if (success) {
      setTitle('');
      setDescription('');
      setPriority(5);
      setCategoryId(null);
      onCreated?.();
    }
  };

  return (
    <form onSubmit={submit}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 'auto' },
          }}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 'auto' },
          }}
        />
        <TextField
          label="Priority"
          type="number"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          sx={{
            width: { xs: '100%', sm: 120 },
          }}
        />

        <CategorySelector value={categoryId} onChange={(v) => setCategoryId(v)} />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Add
        </Button>
      </Stack>
    </form>
  );
};
