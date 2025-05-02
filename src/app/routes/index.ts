import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { requestRoutes } from '../modules/bloodRequest/bloodRequest.route';
import { appointmentRoutes } from '../modules/appointment/appointment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/request',
    route: requestRoutes,
  },
  {
    path: '/appointment',
    route: appointmentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
