import taskRepository from '../repositories/task.repository.js';
import ApiError from '../utils/ApiError.js';

class TaskService {
  async getAll(query, user) {
    const filters = { ...query };

    if (user.role !== 'admin') {
      filters.assigned_to = user.id;
    }

    return taskRepository.findAll(filters);
  }

  async getById(id, user) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (user.role !== 'admin' && task.assigned_to !== user.id && task.created_by !== user.id) {
      throw new ApiError(403, 'Access denied');
    }

    return task;
  }

  async create(data, userId) {
    return taskRepository.create({ ...data, created_by: userId });
  }

  async update(id, data) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    return taskRepository.update(id, data);
  }

  async updateStatus(id, status, user) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (user.role !== 'admin' && task.assigned_to !== user.id) {
      throw new ApiError(403, 'Only assigned user or admin can update status');
    }

    return taskRepository.update(id, { status });
  }

  async delete(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    return taskRepository.delete(id);
  }
}

export default new TaskService();
