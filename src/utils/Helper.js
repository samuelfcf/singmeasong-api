class Helper {
  sucess = (res, data) => {
    return res.status(data.status || 200).send({
      ...data
    });
  };

  failed = (res, catchError) => {
    const status = catchError.status < 1000 ? catchError.status : 500;
    return res.status(status).send({
      message: catchError.message
    });
  };
}

export default new Helper();
