class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const handleApiError = (error, res) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
  
  // Handle database errors
  if (error.code === '23505') { // Unique violation
    return res.status(400).json({
      success: false,
      message: 'A record with this data already exists.'
    });
  }
  
  // Default error response
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
};

const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

const validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation Error',
    errors
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch((error) => handleApiError(error, res));
};

module.exports = {
  ApiError,
  handleApiError,
  successResponse,
  notFoundResponse,
  validationError,
  asyncHandler
};
