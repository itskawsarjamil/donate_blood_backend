import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authController } from './auth.controller';
import { authValidationSchema } from './auth.validation';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidationSchema.loginValidationSchema),
  authController.login,
);

router.post(
  '/refresh-token',
  validateRequest(authValidationSchema.refreshTokenValidationSchema),
  authController.refreshToken,
);

router.post('/change-password', auth(), authController.changePassword);

router.post('/forget-password', authController.forgetPassword);

router.post('/reset-password', authController.resetPassword);

export const authRoutes = router;
