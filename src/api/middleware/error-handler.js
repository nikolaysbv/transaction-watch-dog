import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  if (err?.errors && err.errors[0].type === "Validation error") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = err.errors
      .map((item) => `${item.path} ${item.message}`)
      .join(", ");
  }

  // if (err.code && err.code === 11000) {
  //   defaultError.statusCode = StatusCodes.BAD_REQUEST
  //   defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
  // }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
