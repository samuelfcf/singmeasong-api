const HandleErrors = (err, _, res, __) => {
  const defaultData = {
    status: 400,
    message: 'Bad inputs, please try again!'
  };

  res.status(defaultData.status).send({
    message: defaultData.message
  });
};

export default HandleErrors;
