const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'kumbh_mela_nashik_secret_key_2026_super_secure';
    const decoded = jwt.verify(token, secret);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token' });
  }
};

module.exports = authMiddleware;
