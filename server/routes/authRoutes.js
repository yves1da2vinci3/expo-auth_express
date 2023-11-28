import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

router.get('/protected', authenticateToken, (req, res) => {
  const dummyData = Array.from({ length: Math.floor(Math.random() * 20) }, (_, index) => ({
    id: index + 1,
    message: `Data ${index + 1}`,
  }));
  res.json({ dummyData });
});

export default router;
