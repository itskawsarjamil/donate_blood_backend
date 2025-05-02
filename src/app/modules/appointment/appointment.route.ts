import { Router } from 'express';
import auth from '../../middleware/auth';

import validateRequest from '../../middleware/validateRequest';
import { appointmentController } from './appointment.controller';
import { appointmentValidations } from './appointment.validation';

const router = Router();

router.get(
  '/get-all-appointment-of-my-req',
  auth(),
  appointmentController.getAllAppointmentofMyReq,
);
router.get(
  '/get-all-appointment-of-my-donation',
  auth(),
  appointmentController.getAllMyAppointmentsofMyDonation,
);
router.get(
  '/get-current-appointment-of-my-donation',
  auth(),
  appointmentController.getTheCurrentAppointmentOfmyDonation,
);

router.post(
  '/create-appointment',
  auth(),
  validateRequest(appointmentValidations.createAppointmentSchema),
  appointmentController.createAppointment,
);

router.patch(
  '/update-single-appointment/:appointmentId',
  auth(),
  appointmentController.updateSingleAppointmentofMyRequest,
);

export const appointmentRoutes = router;
