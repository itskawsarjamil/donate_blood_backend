import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userServices } from './user.services';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';
import { userQueryFields, userSearchableFields } from './user.const';
import { queryOptions } from '../../const';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);
  // console.log(result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'user registered successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.getSingleUserFromDB(req.params.userId);
  res.status(200).json({
    success: true,
    message: 'user finding successfull',
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const filterData = pick(req.query, userQueryFields);
  const filterOptions = pick(req.query, queryOptions);
  // console.log(filterData, filterOptions);
  const result = await userServices.getALLUserFromDB(filterData, filterOptions);
  res.status(200).json({
    success: true,
    message: 'user finding successfull',
    data: result,
  });
});

const updateSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.updateUserIntoDB(
    req.params.userId,
    req.body,
  );
  res.status(200).json({
    success: true,
    message: 'user update successfull',
    data: result,
  });
});

const deleteSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.deleteSingleUserFromDB(req.params.userId);
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
