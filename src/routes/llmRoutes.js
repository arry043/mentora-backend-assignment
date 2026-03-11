import express from 'express';
import { summarize } from '../controllers/llmController.js';
import { summarizeSchema } from '../validators/llmValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { llmRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.use(authenticate);

router.post('/summarize', llmRateLimiter, validate(summarizeSchema), summarize);

export default router;
