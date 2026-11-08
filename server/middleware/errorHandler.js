function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler: turns Mongoose/JS errors into clean JSON with proper status codes.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Schema validation failed (required, min, match, custom validators)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: errors[0], errors });
  }

  // Unique index violation, e.g. email already registered
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  // Bad ObjectId in a query
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }

  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
}

module.exports = { notFound, errorHandler };
