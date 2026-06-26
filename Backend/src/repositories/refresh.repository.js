import { RefreshToken } from '../models/index.js';

class RefreshRepository {
  async create(userId, token, expiresAt) {
    return RefreshToken.create({ user_id: userId, token, expires_at: expiresAt });
  }

  async findByToken(token) {
    return RefreshToken.findOne({ where: { token } });
  }

  async delete(id) {
    return RefreshToken.destroy({ where: { id } });
  }

  async deleteAllForUser(userId) {
    return RefreshToken.destroy({ where: { user_id: userId } });
  }

  async deleteExpired() {
    return RefreshToken.destroy({ where: { expires_at: { [Op.lt]: new Date() } } });
  }
}

export default new RefreshRepository();
