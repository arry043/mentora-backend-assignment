import * as llmService from '../services/llmService.js';

export const summarize = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (text.length > 10000) {
      return res.status(413).json({ success: false, message: 'Text cannot exceed 10000 characters' });
    }
    const result = await llmService.summarizeText(text);
    res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    if (error.message.includes('not configured')) res.status(503);
    next(error);
  }
};
