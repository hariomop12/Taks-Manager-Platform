import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export default function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return ApiResponse.send(res, err.statusCode, err.message);
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message).join(', ');
    return ApiResponse.send(res, 400, messages);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ApiResponse.send(res, 400, 'Invalid reference: related record not found');
  }

  console.error('Unhandled Error:', err);
  return ApiResponse.send(res, 500, 'Internal server error');
}
