import { StatusCodes } from 'http-status-codes';
import ApiError from '../../error/ApiError';
import { UserModel } from './user.model';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

const createUserIntoDB = async (payload: any) => {
  // Check if PIN is exactly 5 digits before hashing
  if (!/^\d{5}$/.test(payload.pin)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'PIN must be exactly 5 digits');
  }
  // Hash the PIN before saving
  const saltRounds = 10;
  const hashedPin = await bcryptjs.hash(payload.pin, saltRounds);

  // Replace plain PIN with hashed PIN
  payload.pin = hashedPin;
  const createUserData = await UserModel.create(payload);
  return createUserData;
};

const getAllUsersFromDB = async (phone?: string) => {
  const query: any = { isDeleted: false };

  if (phone) {
    query.mobileNumber = { $regex: phone, $options: 'i' };
  }

  const data = await UserModel.find(query);
  return data;
};

const getUserByIdfromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const data = await UserModel.findOne({
    _id: objectId,
    isDeleted: false,
    isActive: true,
  }).populate('transactions');
  if (!data) throw new ApiError(404, 'User not found');
  return data;
};

const userBlocked = async (id: string) => {
  const user = await UserModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  if (!user) throw new ApiError(404, 'User not found');

  const blockedUser = await UserModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  return blockedUser;
};
const userUnBlocked = async (id: string) => {
  const user = await UserModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: false,
  });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const unblockedUser = await UserModel.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  );
  return unblockedUser;
};

const softDeleteUser = async (id: string) => {
  const user = await UserModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  if (!user) throw new ApiError(404, 'User not found');

  const softDeletedUser = await UserModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return softDeletedUser;
};

const updateUser = async (id: string, updateData: any) => {
  const user = await UserModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isDeleted) throw new ApiError(400, 'Cannot update a deleted user');
  const updateUser = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updateUser;
};

export const UserService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdfromDB,
  userBlocked,
  userUnBlocked,
  softDeleteUser,
  updateUser,
};
