import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T;
  },
) => {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data?.meta,
    data: data.data,
  });
};

export default sendResponse;

type TData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export const sendResponse2 = <T>(res: Response, data: TData<T>) => {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data?.meta,
    data: data.data,
  });
};
