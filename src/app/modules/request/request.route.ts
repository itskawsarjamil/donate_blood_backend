import { Router } from 'express';
import auth from '../../middleware/auth';
import { requestController } from './request.controller';

const router = Router();

router.get('get-all-request', auth(), requestController.getAllRequest);

router.post('create-request', auth(), requestController.createRequest);

router.patch('update-request', auth(), requestController.updateRequest);
