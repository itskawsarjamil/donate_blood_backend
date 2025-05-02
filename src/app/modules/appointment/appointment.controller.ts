import catchAsync from '../../utils/catchAsync';
import { mergeDateandTime } from '../../utils/mergeDateandTime';
import sendResponse from '../../utils/sendResponse';
import { appointmentServices } from './appointment.services';

const createAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await appointmentServices.createAppointment(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Appointment Creation Successfull',
    data: result,
  });
});

const getAllAppointmentofMyReq = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await appointmentServices.getAllAppointmentofMyReq(user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Getting all my appointment of my request successfull',
    data: result,
  });
});
const getAllMyAppointmentsofMyDonation = catchAsync(async (req, res) => {
  const user = req.user;
  const result =
    await appointmentServices.getAllMyAppointmentsofMyDonation(user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Getting all my appointment of my donation successfull',
    data: result,
  });
});
const getTheCurrentAppointmentOfmyDonation = catchAsync(async (req, res) => {
  const user = req.user;
  const result =
    await appointmentServices.getTheCurrentAppointmentOfmyDonation(user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Getting the current appointment of my request successfull',
    data: result,
  });
});

const updateSingleAppointmentofMyRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const appointmentId = req.params.appointmentId;
  const result = await appointmentServices.updateSingleAppointmentofMyRequest(
    user,
    appointmentId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'updating a single appointment of my request successfull',
    data: result,
  });
});

export const appointmentController = {
  createAppointment,
  getAllAppointmentofMyReq,
  getAllMyAppointmentsofMyDonation,
  getTheCurrentAppointmentOfmyDonation,
  updateSingleAppointmentofMyRequest,
};
