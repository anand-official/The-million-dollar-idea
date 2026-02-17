import { Router } from 'express';
import { createAnalytics, getAnalytics, getAnalyticsById, deleteAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate); // All routes require authentication
router.use(apiLimiter); // Apply rate limiting

router.post('/', createAnalytics);
router.get('/', getAnalytics);
router.get('/:id', getAnalyticsById);
router.delete('/:id', deleteAnalytics);

export default router;
