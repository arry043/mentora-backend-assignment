import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { createBookingSchema } from '../validators/bookingValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('parent'));

router.post('/', validate(createBookingSchema), createBooking);

export default router;
