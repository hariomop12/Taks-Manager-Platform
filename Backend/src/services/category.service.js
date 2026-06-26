import categoryRepository from '../repositories/category.repository.js';
import ApiError from '../utils/ApiError.js';

class CategoryService {
  async getAll() {
    return categoryRepository.findAll();
  }

  async create(data) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) {
      throw new ApiError(409, 'Category already exists');
    }
    return categoryRepository.create(data);
  }

  async update(id, data) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    if (data.name && data.name !== category.name) {
      const existing = await categoryRepository.findByName(data.name);
      if (existing) {
        throw new ApiError(409, 'Category name already in use');
      }
    }

    return categoryRepository.update(id, data);
  }

  async delete(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return categoryRepository.delete(id);
  }
}

export default new CategoryService();
