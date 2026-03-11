import { z } from 'zod';

export const summarizeSchema = z.object({
  body: z.object({
    text: z.string()
      .min(50, "Text must be at least 50 characters long"),
  })
});
