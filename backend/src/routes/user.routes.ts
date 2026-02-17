import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Placeholder user routes
router.get('/', (req, res) => {
  res.json({ message: 'User routes' });
});

export default router;
