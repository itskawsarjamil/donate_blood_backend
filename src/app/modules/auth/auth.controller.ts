import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.services';

const login = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authServices.login(payload);
  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'login successfull',
    data: {
      accessToken: accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const result = await authServices.refreshToken(token);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'accessToken generate successffully!',
    data: result,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await authServices.changePassword(user, req.body);
  sendResponse(res, {
    success: true,
    message: 'password changed successffull',
    statusCode: 200,
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authServices.forgetPassword(payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'a reset mail sent',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await authServices.resetPassword(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'password reset successfull',
    data: result,
  });
});

export const authController = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
