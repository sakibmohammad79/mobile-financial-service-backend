import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { UserModel } from '../user/user.model';
import ApiError from '../../error/ApiError';
import { StatusCodes } from 'http-status-codes';
import { jwtHelpers } from '../../../helpers/jwtHelper';
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
  if (!user.isActive) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is blocked');
  }

  // Validate password
  //   const isPasswordValid = await bcrypt.compare(pin, user.pin);
  //   if (!isPasswordValid) {
  //     throw new ApiError(
  //       StatusCodes.UNAUTHORIZED,
  //       'Invalid email or mobile number or password',
  //     );
  //   }

  // Generate JWT token
  const jwtPayload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.jwt.access_token_secret as string,
    { expiresIn: '14d' },
  );

  return { token, user };
};

export const AuthService = {
  loginUserIntoDB,
};
