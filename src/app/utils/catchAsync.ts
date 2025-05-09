import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.resolve(fn(req, res, next)).catch((e) => next(e));
  };
};

export default catchAsync;
