export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('\x1b[31m[Server Error]:\x1b[0m', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid resource identifier: ${err.value}`,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
