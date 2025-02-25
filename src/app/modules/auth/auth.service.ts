import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../user/user.model';
import ApiError from '../../error/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';

const loginUserIntoDB = async (identifier: string, pin: string) => {
  // Check if the user exists using email or mobile number
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  if (!user) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Invalid email or mobile number or pin',
    );
  }

  // Check if the user is blocked
  if (!user.isActive || user.isDeleted) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Your account is blocked or deleted.',
    );
  }

  // Validate pin
  const isPinValid = await bcrypt.compare(pin, user.pin);
  if (!isPinValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid pin');
  }

  // Generate JWT token
  const jwtPayload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(jwtPayload, config.jwt.access_token_secret as string, {
    expiresIn: '14d',
  });

  return { token, user };
};

export const AuthService = {
  loginUserIntoDB,
};
