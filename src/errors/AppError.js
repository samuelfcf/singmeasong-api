import { httpStatus } from '../utils/constants.js';

class AppError extends Error {
  status = httpStatus.INTERNAL_SERVER_ERROR;

  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status ?? this.status;
  }
}

export default AppError;
