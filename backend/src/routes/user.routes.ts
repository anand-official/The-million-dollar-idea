import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);
router.use(apiLimiter);

// Placeholder user routes
router.get('/', (req, res) => {
  res.json({ message: 'User routes' });
});

export default router;
