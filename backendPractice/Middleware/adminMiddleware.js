const User = require('../Model/userSchema');

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied, admin privileges required' });
    }
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
