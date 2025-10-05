import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Checkbox, Chip, Grid, IconButton, ListItem, Stack, Tooltip, Typography } from '@mui/material';
import type { FC } from 'react';
import { useTaskStore } from '~/store/task.store';
import type { Task } from '~/types/task.type';

export const TaskItem: FC<{ task: Task; onEdit: () => void }> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTaskStore();

  return (
    <ListItem
      sx={{
        borderBottom: '1px solid #eee',
        '&:hover': { backgroundColor: '#fafafa' },
        alignItems: 'flex-start',
        paddingRight: 15,
      }}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton edge="end" onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton edge="end" onClick={() => deleteTask(task.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      <Checkbox checked={task.isDone} onChange={() => updateTask(task.id, { isDone: !task.isDone })} sx={{ mt: 0.5 }} />

      {/* Layout with Grid */}
      <Grid container spacing={1} flex={1} minWidth={0}>
        {/*  Title + Category */}
        <Stack spacing={0.5} minWidth={0}>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              textDecoration: task.isDone ? 'line-through' : 'none',
              fontWeight: 500,
            }}
          >
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={task?.category?.name ?? 'No category'}
              size="small"
              color={task?.category?.name ? 'secondary' : 'default'}
              sx={{ alignSelf: 'flex-start' }}
            />
            <Chip
              label={task?.priority ?? 'No priority'}
              size="small"
              color={task?.priority ? 'success' : 'default'}
              sx={{ alignSelf: 'flex-start' }}
            />
          </Box>
        </Stack>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            fontStyle="italic"
            sx={{
              textDecoration: task.isDone ? 'line-through' : 'none',
              minWidth: 0,
            }}
          >
            {task.description}
          </Typography>
        )}
      </Grid>
    </ListItem>
  );
};
