import express from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import llmRoutes from './llmRoutes.js';
import { getMe } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.get('/me', authenticate, getMe);
router.use('/students', studentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/bookings', bookingRoutes);
router.use('/sessions', sessionRoutes);
router.use('/llm', llmRoutes);

export default router;
