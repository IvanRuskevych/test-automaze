import { CircularProgress, List, Typography } from '@mui/material';
import { type FC, useEffect, useState } from 'react';
import EditTaskModal from '~/components/EditTaskModal.tsx';
import { TaskItem } from '~/components/TaskItem.tsx';
import { useTaskStore } from '~/store/task.store';

export const TaskList: FC = () => {
  const { tasks, loading, fetchTasks } = useTaskStore();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks().then();
  }, [fetchTasks]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <List>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={() => setEditingTaskId(task.id)} />
        ))}
      </List>

      {tasks.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          No tasks found
        </Typography>
      )}

      {editingTaskId && <EditTaskModal taskId={editingTaskId} onClose={() => setEditingTaskId(null)} />}
    </>
  );
};
