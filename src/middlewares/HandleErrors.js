import AppError from '../errors/AppError.js';

const HandleErrors = (err, _, res, __) => {
  const defaultData = {
    status: 400,
    message: 'Bad inputs, please try again!'
  };

  if (err instanceof AppError) {
    defaultData.status = err.status;
    defaultData.message = err.message;
  }

  res.status(defaultData.status).send({
    message: defaultData.message
  });
};

export default HandleErrors;
