import express from 'express';
import { createSession, joinSession } from '../controllers/sessionController.js';
import { createSessionSchema, joinSessionSchema } from '../validators/sessionValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Mentor creates session
router.post('/', authorizeRoles('mentor'), validate(createSessionSchema), createSession);
router.post('/:sessionId/join', authorizeRoles('parent'), validate(joinSessionSchema), joinSession);

export default router;
