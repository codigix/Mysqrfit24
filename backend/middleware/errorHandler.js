export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details || null,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
