import express from 'express';
import { createLesson, getLessons } from '../controllers/lessonController.js';
import { createLessonSchema } from '../validators/lessonValidator.js';
import { getSessions } from '../controllers/sessionController.js';
import { getSessionsParamsSchema } from '../validators/sessionValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

// List lessons is available to all authenticated users
router.get('/', getLessons);

// Get sessions for a lesson
router.get('/:lessonId/sessions', validate(getSessionsParamsSchema), getSessions);

// Create lesson is restricted to mentors
router.post('/', authorizeRoles('mentor'), validate(createLessonSchema), createLesson);

export default router;
