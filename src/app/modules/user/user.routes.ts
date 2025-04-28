import { Router } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchema } from './user.validation';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-user',
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createUser,
);

router.get('/get-single-user/:userId', userController.getSingleUser);
router.get('/get-all-user', userController.getAllUser);

router.patch(
  '/update-single-user/:userId',
  validateRequest(userValidationSchema.updateUserValidationSchema),
  userController.updateSingleUser,
);
router.delete('/delete-single-user/:userId', userController.deleteSingleUser);

router.get('/get-my-profile', auth(), userController.getMyProfile);

export const userRoutes = router;
