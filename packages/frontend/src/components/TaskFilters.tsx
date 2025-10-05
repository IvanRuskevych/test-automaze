import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { type FC, useEffect, useState } from 'react';
import { useTaskStore } from '~/store/task.store';
import type { TaskStatus } from '~/types/task.type.ts';

export const TaskFilters: FC = () => {
  const [status, setStatus] = useState<TaskStatus>('all');
  const [priorityOrder, setPriorityOrder] = useState<'asc' | 'desc'>('asc');

  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks({
      filter: status === 'all' ? {} : { status },
      orderBy: { field: 'priority', direction: priorityOrder },
    }).then();
  }, [status, priorityOrder, fetchTasks]);

  const handleReset = () => {
    setStatus('all');
    setPriorityOrder('asc');
    fetchTasks().then();
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="done">Done</MenuItem>
          <MenuItem value="undone">Undone</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort by priority</InputLabel>
        <Select value={priorityOrder} label="Sort by priority" onChange={(e) => setPriorityOrder(e.target.value)}>
          <MenuItem value="asc">Low → High</MenuItem>
          <MenuItem value="desc">High → Low</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={handleReset}>
        Reset
      </Button>
    </Stack>
  );
};
