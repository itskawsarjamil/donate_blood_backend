import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import config from '../config';

type TErrorSources = {
  path: string | undefined;
  message: string | undefined;
}[];
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = 500;
  const message = 'something went wrong';
  const errorSources: TErrorSources = [
    {
      path: '',
      message: '',
    },
  ];
  return res.status(status).json({
    success: false,
    message,
    errorSources,
    error,
    stack: config.node_env === 'development' ? error?.stack : null,
  });
};

export default globalErrorHandler;
