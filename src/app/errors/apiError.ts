class AppError extends Error {
  statusCode: number;
  constructor(code: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
