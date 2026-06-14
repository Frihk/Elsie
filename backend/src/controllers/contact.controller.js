import { createHttpError } from '../utils/createHttpError.js';

export function createContactMessage(req, res, next) {
  const { email, message, name } = req.body;

  if (!name || !email || !message) {
    return next(createHttpError(400, 'Name, email, and message are required.'));
  }

  res.status(201).json({
    data: {
      email,
      message,
      name,
      status: 'received',
    },
  });
}
