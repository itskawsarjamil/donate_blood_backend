import config from '../config';
import AppError from '../errors/apiError';
import catchAsync from '../utils/catchAsync';
import { jwtHelper } from '../utils/jwtHelper';
import prisma from '../utils/prisma';

const auth = () => {
  return catchAsync(async (req, res, next) => {
    const accessToken = req.headers.authorization;
    const decoded = jwtHelper.verifyToken(
      accessToken as string,
      config.jwt.jwt_secret as string,
    );
    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
      },
    });
    if (!user) {
      throw new AppError(404, 'user not found');
    }
    req.user = decoded;
    next();
  });
};

export default auth;
