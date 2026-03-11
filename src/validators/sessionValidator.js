import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSessionSchema = z.object({
  body: z.object({
    lessonId: z.string().regex(objectIdRegex, "Invalid lessonId"),
    date: z.string().datetime({ message: "Invalid date format, use ISO 8601 string" }).or(z.date()),
    topic: z.string().min(3, "Topic must be at least 3 characters long"),
    summary: z.string().min(5, "Summary must be at least 5 characters long"),
  })
});

export const getSessionsParamsSchema = z.object({
  params: z.object({
    lessonId: z.string().regex(objectIdRegex, "Invalid lessonId parameter")
  })
});

export const joinSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().regex(objectIdRegex, "Invalid sessionId parameter")
  }),
  body: z.object({
    studentId: z.string().regex(objectIdRegex, "Invalid studentId")
  })
});
