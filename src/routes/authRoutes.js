import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
