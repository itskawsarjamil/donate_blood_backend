import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { ZodError } from 'zod';
import { TErrorSources } from '../interfaces/errorTypes';
import handleZodError from '../errors/handleZodError';
import { Prisma } from '../../../generated/prisma';
import AppError from '../errors/apiError';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let flag = 0;
  let status = 500;
  let message = 'something went wrong';
  let issues: TErrorSources = [
    {
      path: '',
      message: '',
    },
  ];
  if (error instanceof ZodError) {
    flag = 1;
    const errorData = handleZodError(error);
    status = errorData.statusCode;
    message = errorData.message;
    issues = errorData.errorSources;
  }
  // Prisma known errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[])?.join(', ');
        status = 409;
        message = 'Duplicate field value';
        issues = [
          {
            path: target,
            message: '',
          },
        ];
        break;
      }

      case 'P2025': {
        status = 404;
        message = 'Resource not found';
        break;
      }

      case 'P2003': {
        status = 400;
        message = 'foreign key constraint failed';
        break;
      }

      default:
        status = 500;
        message = `Prisma known request error ${error.code}`;
        break;
    }
  }
  // Prisma validation errors
  else if (error instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = 'Validation error: Check the provided data';
    error = error.message;
  }

  // Prisma initialization errors
  else if (error instanceof Prisma.PrismaClientInitializationError) {
    status = 500;
    message = 'Prisma failed to connect to the database';
  }

  // Prisma panic errors (unexpected)
  else if (error instanceof Prisma.PrismaClientRustPanicError) {
    status = 500;
    message = 'Unexpected Prisma error: Rust panic';
  } else if (error instanceof AppError) {
    status = error?.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(status).json({
    success: false,
    message,
    // errorDetails: flag
    //   ? {
    //       issues,
    //     }
    //   : 'error',
    errorDetails: {
      issues,
    },
    error: config.node_env === 'development' ? error : null,
    stack: config.node_env === 'development' ? error?.stack : null,
  });
};

export default globalErrorHandler;
