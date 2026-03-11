import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createBookingSchema = z.object({
  body: z.object({
    studentId: z.string().regex(objectIdRegex, "Invalid studentId"),
    lessonId: z.string().regex(objectIdRegex, "Invalid lessonId"),
  })
});
