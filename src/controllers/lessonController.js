import * as lessonService from '../services/lessonService.js';

export const createLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.createLesson(req.body, req.user._id);
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
};

export const getLessons = async (req, res, next) => {
  try {
    const lessons = await lessonService.getLessons();
    res.status(200).json({ success: true, count: lessons.length, data: lessons });
  } catch (error) {
    next(error);
  }
};
