import { Box, Container, Divider, Paper, Typography } from '@mui/material';
import { type FC } from 'react';
import { TaskFilters, TaskForm, TaskList } from '~/components';

export const Home: FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Task Manager
        </Typography>

        <TaskForm />

        <Divider sx={{ my: 3 }} />

        <TaskFilters />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 2 }}>
          <TaskList />
        </Box>
      </Paper>
    </Container>
  );
};
