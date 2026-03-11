import { Lesson } from '../models/Lesson.js';

export const createLesson = async (lessonData, mentorId) => {
  if (lessonData.mentorId !== mentorId.toString()) {
    const error = new Error('mentorId must match the authenticated mentor');
    error.statusCode = 403;
    throw error;
  }

  const lesson = await Lesson.create({
    title: lessonData.title,
    description: lessonData.description,
    mentorId
  });
  return lesson;
};

export const getLessons = async () => {
  return await Lesson.find().populate('mentorId', 'name');
};
