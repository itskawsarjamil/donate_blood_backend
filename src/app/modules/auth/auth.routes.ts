import { Router } from 'express';
import { authController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { authValidationSchema } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidationSchema.loginValidationSchema),
  authController.login,
);

router.post('/refresh-token', authController.refreshToken);

router.post('/change-password', authController.changePassword);

router.post('/forget-password', authController.forgetPassword);

router.post('/reset-password', authController.resetPassword);

export const authRoutes = router;
