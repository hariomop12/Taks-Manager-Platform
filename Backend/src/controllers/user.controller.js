import userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, search, sortBy, sortOrder, role, is_active } = req.query;
    const result = await userService.getAll({ page, limit, search, sortBy, sortOrder, filters: { role, is_active } });
    ApiResponse.send(res, 200, 'Users retrieved', result.users, { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    ApiResponse.send(res, 200, 'User retrieved', user);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body, req.user);
    ApiResponse.send(res, 200, 'User updated', user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await userService.delete(req.params.id);
    ApiResponse.send(res, 200, 'User deactivated');
  } catch (err) {
    next(err);
  }
};
