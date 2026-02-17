import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter); // Apply rate limiting first
router.use(authenticate); // Then authentication

// Placeholder user routes
router.get('/', (req, res) => {
  res.json({ message: 'User routes' });
});

export default router;
