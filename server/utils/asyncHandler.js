// Wraps async route handlers so thrown errors reach errorHandler
// (no try/catch needed in every controller).
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
