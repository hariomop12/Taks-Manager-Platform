import categoryService from '../services/category.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    ApiResponse.send(res, 200, 'Categories retrieved', categories);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    ApiResponse.send(res, 201, 'Category created', category);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    ApiResponse.send(res, 200, 'Category updated', category);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await categoryService.delete(req.params.id);
    ApiResponse.send(res, 200, 'Category deleted');
  } catch (err) {
    next(err);
  }
};
