import * as bookingService from '../services/bookingService.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user._id);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
