import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    age: z.number().int().positive("Age must be a positive integer"),
  })
});
