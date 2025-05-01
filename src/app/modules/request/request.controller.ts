import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { requestServices } from './request.services';

const createRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await requestServices.createRequest(user, payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Request Creation Successfull',
    data: result,
  });
});

const getAllRequest = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await requestServices.getAllRequest(user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Getting all donation request successfull',
    data: result,
  });
});

const updateRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await requestServices.updateRequest(user, payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'donation request update successfull',
    data: result,
  });
});

export const requestController = {
  createRequest,
  getAllRequest,
  updateRequest,
};
