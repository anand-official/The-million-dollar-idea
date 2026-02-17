import { Router } from 'express';
import { generateInsights, askQuestion, predictTrends } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate); // All routes require authentication
router.use(aiLimiter); // Apply AI-specific rate limiting

router.post('/insights', generateInsights);
router.post('/ask', askQuestion);
router.post('/predict', predictTrends);

export default router;
