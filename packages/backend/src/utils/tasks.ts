import { tasksRepository } from '~/repositories/index.js';
import { ApiErrors } from '~/utils/errors/index.js';

export async function getTaskOrFail(taskId: string) {
  const task = await tasksRepository.findById(taskId);
  if (!task) throw ApiErrors.NotFound('Task not found');
  return task;
}
