import { httpStatus } from '../utils/constants.js';

class HelperResponse {
  success = (res, data) => {
    return res.status(data.status || httpStatus.SUCCESS).send({
      ...data
    });
  };

  failed = (res, catchError) => {
    const status =
      catchError.status < 1000
        ? catchError.status
        : httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).send({
      message: catchError.message
    });
  };
}

export default new HelperResponse();
