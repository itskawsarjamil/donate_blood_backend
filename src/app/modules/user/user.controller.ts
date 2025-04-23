import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userServices } from './user.services';
import sendResponse from '../../utils/sendResponse';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);
  // console.log(result);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'user creation successfull',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.getSingleUserFromDB(req.params.id);
  res.status(200).json({
    success: true,
    message: 'user finding successfull',
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await userServices.getALLUserFromDB();
  res.status(200).json({
    success: true,
    message: 'user finding successfull',
    data: result,
  });
});

const updateSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.updateUserIntoDB(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'user update successfull',
    data: result,
  });
});

const deleteSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.deleteSingleUserFromDB(req.params.id);
  res.status(200).json({
    success: true,
    message: 'user deletion complete',
    data: result,
  });
});

export const userController = {
  createUser,
  getSingleUser,
  getAllUser,
  updateSingleUser,
  deleteSingleUser,
};
