import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    try {
      const connection = await pool.getConnection();
      const [users] = await connection.query('SELECT id, email, is_admin FROM users WHERE id = ?', [decoded.id]);
      connection.release();

      if (users.length === 0) {
        return res.status(401).json({ error: 'User account no longer exists' });
      }

      req.user = users[0];
      next();
    } catch (dbErr) {
      console.error('Auth middleware database error:', dbErr);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  });
};

export const adminRequired = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (!req.user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};
