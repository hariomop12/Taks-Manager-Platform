import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import jwtConfig from '../config/jwt.js';
import userRepository from '../repositories/user.repository.js';
import refreshRepository from '../repositories/refresh.repository.js';
import ApiError from '../utils/ApiError.js';

class AuthService {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Email already registered');
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ name, email, password: hashed });

    const tokens = await this._generateTokens(user);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }
    if (!user.is_active) {
      throw new ApiError(403, 'Account is deactivated');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokens = await this._generateTokens(user);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
  }

  async refresh(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const stored = await refreshRepository.findByToken(refreshToken);
    if (!stored) {
      throw new ApiError(401, 'Refresh token not found');
    }

    await refreshRepository.delete(stored.id);

    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    if (!user.is_active) {
      throw new ApiError(403, 'Account is deactivated');
    }

    const tokens = await this._generateTokens(user);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
  }

  async logout(refreshToken) {
    const stored = await refreshRepository.findByToken(refreshToken);
    if (stored) {
      await refreshRepository.delete(stored.id);
    }
  }

  async _generateTokens(user) {
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      jwtConfig.accessTokenSecret,
      { expiresIn: jwtConfig.accessTokenExpiry },
    );

    const refreshToken = jwt.sign(
      { sub: user.id, jti: uuidv4() },
      jwtConfig.refreshTokenSecret,
      { expiresIn: jwtConfig.refreshTokenExpiry },
    );

    const expiresAt = new Date(Date.now() + jwtConfig.refreshTokenExpiryMs);
    await refreshRepository.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
