import taskService from '../services/task.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await taskService.getAll(req.query, req.user);
    ApiResponse.send(res, 200, 'Tasks retrieved', result.tasks, { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const task = await taskService.create(req.body, req.user.id);
    ApiResponse.send(res, 201, 'Task created', task);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const task = await taskService.getById(req.params.id, req.user);
    ApiResponse.send(res, 200, 'Task retrieved', task);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const task = await taskService.update(req.params.id, req.body);
    ApiResponse.send(res, 200, 'Task updated', task);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateStatus(req.params.id, req.body.status, req.user);
    ApiResponse.send(res, 200, 'Task status updated', task);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await taskService.delete(req.params.id);
    ApiResponse.send(res, 200, 'Task deleted');
  } catch (err) {
    next(err);
  }
};
