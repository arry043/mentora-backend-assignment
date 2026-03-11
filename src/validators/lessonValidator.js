import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    mentorId: z.string().regex(objectIdRegex, "Invalid mentorId"),
  })
});
