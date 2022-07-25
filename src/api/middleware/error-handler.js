const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, try again later",
  };

  if (err?.errors && err.errors[0].type === "Validation error") {
    defaultError.statusCode = 400;
    defaultError.msg = err.errors
      .map((item) => `${item.path} ${item.message}`)
      .join(", ");
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
