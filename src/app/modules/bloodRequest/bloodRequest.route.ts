import { Router } from 'express';
import auth from '../../middleware/auth';
import { requestController } from './bloodRequest.controller';
import validateRequest from '../../middleware/validateRequest';
import { bloodRequestValidations } from './bloodRequest.validation';

const router = Router();

router.get('/get-all-request', auth(), requestController.getAllRequest);

router.post(
  '/create-request',
  auth(),
  validateRequest(bloodRequestValidations.createDonationRequestSchema),
  requestController.createRequest,
);

router.patch(
  '/update-request/:requestId',
  auth(),
  requestController.updateRequest,
);

export const requestRoutes = router;
