import * as studentService from '../services/studentService.js';

export const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body, req.user._id);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await studentService.getStudentsByParent(req.user._id);
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};
