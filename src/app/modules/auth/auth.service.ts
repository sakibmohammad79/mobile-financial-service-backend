import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../user/user.model';
import ApiError from '../../error/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import { AgentModel } from '../agent/agent.mode';
import { AdminModel } from '../admin/admin.model';

export const loginUserIntoDB = async (identifier: string, pin: string) => {
  // Check if the identifier (email or phone) belongs to a User, Agent, or Admin
  let user = await UserModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  let agent = await AgentModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  let admin = await AdminModel.findOne({
    $or: [{ email: identifier }, { mobileNumber: identifier }],
  });

  // Determine user role
  let account = user || agent || admin;
  if (!account) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  // Check if account is active (Users & Agents)
  if ((user || agent) && (!account.isActive || account.isDeleted)) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Your account is blocked or deleted.',
    );
  }

  // If it's an agent, check if it's approved
  if (agent && !agent.isVerified) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Your agent account is not approved yet.',
    );
  }

  // Validate the pin
  const isPinValid = await bcrypt.compare(pin, account.pin);
  if (!isPinValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid pin');
  }

  // Generate JWT token
  const jwtPayload = {
    id: account._id,
    role: account.role,
    email: account.email,
  };

  const token = jwt.sign(jwtPayload, config.jwt.access_token_secret as string, {
    expiresIn: '14d',
  });

  return { token, account };
};

export const AuthService = {
  loginUserIntoDB,
};
