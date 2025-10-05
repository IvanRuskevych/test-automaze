import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { type FC, useEffect, useState } from 'react';
import { CategorySelector } from '~/components/CategorySelector';
import { useTaskStore } from '~/store/task.store';

const EditTaskModal: FC<{ taskId: string; onClose: () => void }> = ({ taskId, onClose }) => {
  const { tasks, updateTask } = useTaskStore();
  const task = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState(task?.priority ?? 5);
  const [categoryId, setCategoryId] = useState<string | null>(task?.category?.id ?? null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority ?? 5);
      setCategoryId(task.category?.id ?? null);
    }
  }, [task]);

  const submit = async () => {
    if (!task) return;
    await updateTask(task.id, {
      title,
      description,
      priority,
      categoryId: categoryId ?? undefined,
    });
    onClose();
  };

  return (
    <Dialog open={!!task} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
          />
          <TextField
            label="Priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          />
          <CategorySelector value={categoryId ?? ''} onChange={setCategoryId} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={submit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
