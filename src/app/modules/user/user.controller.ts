import { RequestHandler } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createUser: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body.user;
  const result = await UserService.createUserIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

const getAllUser: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await UserService.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All user fetched successfully!',
    data: result,
  });
});

const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserByIdfromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Single user fetched successfully!',
    data: result,
  });
});

export const UserController = {
  getAllUser,
  createUser,
  getUserById,
};
