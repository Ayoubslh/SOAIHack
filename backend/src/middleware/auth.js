const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION';

/**
 * Verifies the Bearer token in the Authorization header.
 * Attaches { userId, role, exp } to req.auth on success.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: 401, message: 'Missing Authorization header' });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.auth = { userId: payload.sub, role: payload.role, exp: payload.exp };
    next();
  } catch (err) {
    return res.status(401).json({ status: 401, message: err.message });
  }
}

/**
 * Role guard factory. Usage: authorize('admin') or authorize(['admin','staff'])
 */
function authorize(...roles) {
  const allowed = roles.flat();
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ status: 401, message: 'Not authenticated' });
    if (allowed.length && !allowed.includes(req.auth.role)) {
      return res.status(403).json({ status: 403, message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
