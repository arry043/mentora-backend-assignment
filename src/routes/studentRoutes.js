import express from 'express';
import { createStudent, getStudents } from '../controllers/studentController.js';
import { createStudentSchema } from '../validators/studentValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Only parents can manage students
router.use(authenticate, authorizeRoles('parent'));

router.post('/', validate(createStudentSchema), createStudent);
router.get('/', getStudents);

export default router;
