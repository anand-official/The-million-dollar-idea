import { Router } from 'express';
import { createAnalytics, getAnalytics, getAnalyticsById, deleteAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // All routes require authentication

router.post('/', createAnalytics);
router.get('/', getAnalytics);
router.get('/:id', getAnalyticsById);
router.delete('/:id', deleteAnalytics);

export default router;
