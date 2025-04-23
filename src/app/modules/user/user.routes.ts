import { Router } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchema } from './user.validation';

const router = Router();

router.post(
  '/create-user',
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createUser,
);

router.get('/get-single-user', userController.getSingleUser);
router.get('/get-all-user', userController.getAllUser);

router.patch('/update-single-user', userController.updateSingleUser);
router.patch('/delete-single-user', userController.deleteSingleUser);

export const userRoutes = router;
