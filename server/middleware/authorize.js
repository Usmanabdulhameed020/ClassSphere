module.exports = function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (roles.length === 0) return next();
    const userRole = (req.user.role || '').toString().toLowerCase();
    const allowed = roles.map(r => r.toString().toLowerCase());
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
    next();
  };
};
