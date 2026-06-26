import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    ApiResponse.send(res, 201, 'Registration successful', result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    ApiResponse.send(res, 200, 'Login successful', result);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    ApiResponse.send(res, 200, 'Token refreshed', result);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    if (token) {
      await authService.logout(token);
    }
    ApiResponse.send(res, 200, 'Logout successful');
  } catch (err) {
    next(err);
  }
};
