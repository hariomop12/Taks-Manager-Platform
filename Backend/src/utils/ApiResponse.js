class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    if (data) this.data = data;
    if (meta) this.meta = meta;
  }

  static send(res, statusCode, message, data = null, meta = null) {
    const response = new ApiResponse(statusCode, message, data, meta);
    return res.status(statusCode).json(response);
  }
}

export default ApiResponse;
