import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';

class UserService {
  async getAll(query) {
    return userRepository.findAll(query);
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async update(id, data, requestingUser) {
    if (requestingUser.role !== 'admin' && requestingUser.id !== Number(id)) {
      throw new ApiError(403, 'You can only update your own profile');
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== Number(id)) {
        throw new ApiError(409, 'Email already in use');
      }
      updateData.email = data.email;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }
    if (data.profile_image !== undefined) updateData.profile_image = data.profile_image;
    if (requestingUser.role === 'admin') {
      if (data.role) updateData.role = data.role;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;
    }

    const updated = await userRepository.update(id, updateData);
    return updated;
  }

  async delete(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return userRepository.delete(id);
  }
}

export default new UserService();
