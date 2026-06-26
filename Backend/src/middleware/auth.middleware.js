import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import ApiError from '../utils/ApiError.js';

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access token required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
}
