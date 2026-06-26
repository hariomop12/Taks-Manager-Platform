import taskRepository from '../repositories/task.repository.js';
import userRepository from '../repositories/user.repository.js';

class DashboardService {
  async getStats() {
    const totalTasks = await taskRepository.totalCount();
    const totalUsers = await userRepository.countByRole('user');
    const totalAdmins = await userRepository.countByRole('admin');

    const pendingTasks = await taskRepository.countByStatus('pending');
    const inProgressTasks = await taskRepository.countByStatus('in_progress');
    const completedTasks = await taskRepository.countByStatus('completed');
    const cancelledTasks = await taskRepository.countByStatus('cancelled');

    const lowPriority = await taskRepository.countByPriority('low');
    const mediumPriority = await taskRepository.countByPriority('medium');
    const highPriority = await taskRepository.countByPriority('high');
    const criticalPriority = await taskRepository.countByPriority('critical');

    return {
      totalUsers,
      totalAdmins,
      totalTasks,
      tasksByStatus: { pending: pendingTasks, in_progress: inProgressTasks, completed: completedTasks, cancelled: cancelledTasks },
      tasksByPriority: { low: lowPriority, medium: mediumPriority, high: highPriority, critical: criticalPriority },
    };
  }
}

export default new DashboardService();
