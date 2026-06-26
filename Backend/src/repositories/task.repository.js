import { Op } from 'sequelize';
import { Task, User, Category } from '../models/index.js';

class TaskRepository {
  async findAll({ page = 1, limit = 10, search, sortBy = 'created_at', sortOrder = 'DESC', status, priority, assigned_to, category_id, due_date_from, due_date_to } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigned_to) where.assigned_to = assigned_to;

    if (due_date_from || due_date_to) {
      where.due_date = {};
      if (due_date_from) where.due_date[Op.gte] = due_date_from;
      if (due_date_to) where.due_date[Op.lte] = due_date_to;
    }

    const include = [
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
    ];

    if (category_id) {
      include.push({
        model: Category,
        where: { id: category_id },
        attributes: ['id', 'name', 'color'],
        through: { attributes: [] },
      });
    } else {
      include.push({
        model: Category,
        attributes: ['id', 'name', 'color'],
        through: { attributes: [] },
      });
    }

    const { rows, count } = await Task.findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, sortOrder]],
      distinct: true,
      include,
    });

    return { tasks: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findById(id) {
    return Task.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email', 'profile_image'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'profile_image'] },
        { model: Category, attributes: ['id', 'name', 'color'], through: { attributes: [] } },
      ],
    });
  }

  async create(data) {
    const { category_ids, ...taskData } = data;
    const task = await Task.create(taskData);

    if (category_ids && category_ids.length > 0) {
      const categories = await Category.findAll({ where: { id: category_ids } });
      await task.setCategories(categories);
    }

    return this.findById(task.id);
  }

  async update(id, data) {
    const { category_ids, ...taskData } = data;
    const task = await Task.findByPk(id);
    if (!task) return null;

    await task.update(taskData);

    if (category_ids !== undefined) {
      const categories = category_ids.length > 0
        ? await Category.findAll({ where: { id: category_ids } })
        : [];
      await task.setCategories(categories);
    }

    return this.findById(id);
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) return false;
    await task.destroy();
    return true;
  }

  async countByStatus(status) {
    return Task.count({ where: { status } });
  }

  async countByPriority(priority) {
    return Task.count({ where: { priority } });
  }

  async totalCount() {
    return Task.count();
  }
}

export default new TaskRepository();
