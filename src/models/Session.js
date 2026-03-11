import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  date: { type: Date, required: true },
  topic: { type: String, required: true },
  summary: { type: String, required: true },
  joinedStudentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
