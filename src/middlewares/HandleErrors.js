import AppError from '../errors/AppError.js';
import { httpStatus } from '../utils/constants.js';

const HandleErrors = (err, _, res, __) => {
  const defaultData = {
    status: httpStatus.BAD_REQUEST,
    message: ''
  };

  if (Array.isArray(err)) {
    defaultData.message = err[0].message;
  }

  if (err instanceof AppError) {
    defaultData.status = err.status;
    defaultData.message = err.message;
  }

  res.status(defaultData.status).send({
    message: defaultData.message
  });
};

export default HandleErrors;
