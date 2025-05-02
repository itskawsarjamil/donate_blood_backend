import catchAsync from '../../utils/catchAsync';
import { mergeDateandTime } from '../../utils/mergeDateandTime';
import sendResponse from '../../utils/sendResponse';
import { requestServices } from './bloodRequest.services';

const createRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const {
    dateOfDonation: userGivenDate,
    timeOfDonation,
    ...remaining
  } = payload;
  const dateOfDonation = mergeDateandTime(userGivenDate, timeOfDonation);
  const user = req.user;
  const result = await requestServices.createBloodRequest(user, {
    ...remaining,
    dateOfDonation,
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Request Creation Successfull',
    data: result,
  });
});

const getAllRequest = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await requestServices.getAllBloodRequest(user);
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
  const requestId = req.params.requestId;
  const result = await requestServices.updateBloodRequest(
    user,
    requestId,
    payload,
  );
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
