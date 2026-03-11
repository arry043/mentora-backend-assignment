import { Booking } from '../models/Booking.js';
import { Student } from '../models/Student.js';
import { Lesson } from '../models/Lesson.js';

export const createBooking = async (bookingData, parentId) => {
  const { studentId, lessonId } = bookingData;

  const student = await Student.findOne({ _id: studentId, parentId });
  if (!student) {
    const error = new Error('Student not found or does not belong to you');
    error.statusCode = 404;
    throw error;
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }

  const existingBooking = await Booking.findOne({ studentId, lessonId });
  if (existingBooking) {
    const error = new Error('Booking already exists for this student and lesson');
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.create({ studentId, lessonId });
  return booking;
};
