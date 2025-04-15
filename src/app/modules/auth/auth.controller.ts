import { RequestHandler } from 'express';

import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';

const loginUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { identifier, pin } = req.body;
  const result = await AuthService.loginUserIntoDB(identifier, pin);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successfully!',
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
