const jwt = require('jsonwebtoken');

// Protects a route: requires "Authorization: Bearer <token>".
// On success, req.user = { id }.
function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired, please log in again' });
  }
}

module.exports = { protect };
