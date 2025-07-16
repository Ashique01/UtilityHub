module.exports = function (req, res, next) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};
