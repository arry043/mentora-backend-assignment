import * as sessionService from '../services/sessionService.js';

export const createSession = async (req, res, next) => {
  try {
    const session = await sessionService.createSession(req.body, req.user._id);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getSessionsByLesson(req.params.lessonId);
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    next(error);
  }
};

export const joinSession = async (req, res, next) => {
  try {
    const session = await sessionService.joinSession(
      req.params.sessionId,
      req.body.studentId,
      req.user._id
    );
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
