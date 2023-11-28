import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization header format' });
  }

  

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid access token' });
    }

    const userId = decoded.userId;
    try {
      // Check if the user exists in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach the user to the request object for further middleware or routes
      req.user = user;
      next();
    } catch (error) {
      console.error('Error fetching user from database:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

export { authenticateToken };
