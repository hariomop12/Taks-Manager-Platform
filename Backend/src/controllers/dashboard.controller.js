import dashboardService from '../services/dashboard.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    ApiResponse.send(res, 200, 'Dashboard stats retrieved', stats);
  } catch (err) {
    next(err);
  }
};
