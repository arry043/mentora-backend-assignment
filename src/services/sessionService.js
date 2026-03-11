import { Session } from '../models/Session.js';
import { Lesson } from '../models/Lesson.js';
import { Student } from '../models/Student.js';
import { Booking } from '../models/Booking.js';

export const createSession = async (sessionData, mentorId) => {
  const { lessonId, date, topic, summary } = sessionData;

  const lesson = await Lesson.findOne({ _id: lessonId, mentorId });
  if (!lesson) {
    const error = new Error('Lesson not found or you are not the mentor of this lesson');
    error.statusCode = 403;
    throw error;
  }

  const session = await Session.create({ lessonId, date, topic, summary });
  return session;
};

export const getSessionsByLesson = async (lessonId) => {
  return await Session.find({ lessonId }).sort({ date: -1 });
};

export const joinSession = async (sessionId, studentId, parentId) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  const student = await Student.findOne({ _id: studentId, parentId });
  if (!student) {
    const error = new Error('Student not found or does not belong to you');
    error.statusCode = 404;
    throw error;
  }

  const booking = await Booking.findOne({ studentId, lessonId: session.lessonId });
  if (!booking) {
    const error = new Error('Student must be booked to this lesson before joining the session');
    error.statusCode = 400;
    throw error;
  }

  const alreadyJoined = session.joinedStudentIds.some((id) => id.toString() === studentId);
  if (alreadyJoined) {
    const error = new Error('Student has already joined this session');
    error.statusCode = 400;
    throw error;
  }

  session.joinedStudentIds.push(studentId);
  await session.save();

  return session;
};
