import { Student } from '../models/Student.js';

export const createStudent = async (studentData, parentId) => {
  const student = await Student.create({
    ...studentData,
    parentId
  });
  return student;
};

export const getStudentsByParent = async (parentId) => {
  return await Student.find({ parentId });
};
