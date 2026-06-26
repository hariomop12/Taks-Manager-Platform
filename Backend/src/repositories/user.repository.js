import { Op } from 'sequelize';
import { User } from '../models/index.js';

class UserRepository {
  async findAll({ page = 1, limit = 10, search, sortBy = 'created_at', sortOrder = 'DESC', filters = {} }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, sortOrder]],
      attributes: { exclude: ['password'] },
    });

    return { users: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findById(id) {
    return User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async create(data) {
    return User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return user;
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.update({ is_active: 0 });
    return true;
  }

  async countByRole(role) {
    return User.count({ where: { role } });
  }
}

export default new UserRepository();
