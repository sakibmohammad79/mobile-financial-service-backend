import ApiError from '../../error/ApiError';
import { UserModel } from './user.model';

const createUserIntoDB = async (payload: any) => {
  const createUserData = await UserModel.create(payload);
  return createUserData;
};

const getAllUsersFromDB = async () => {
  const data = await UserModel.find({ isDeleted: false });
  return data;
};

const getUserByIdfromDB = async (id: string) => {
  const data = await UserModel.findOne({ _id: id, isDeleted: false }).populate(
    'transactions',
  );
  if (!data) throw new ApiError(404, 'User not found');
  return data;
};

const userBlocked = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new ApiError(404, 'User not found');

  const blockedUser = await UserModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  return blockedUser;
};

const softDeleteUser = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new ApiError(404, 'User not found');

  const softDeletedUser = await UserModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return softDeleteUser;
};

const updateUser = async (id: string, updateData: any) => {
  const user = await UserModel.findById(id);
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
  softDeleteUser,
  updateUser,
};
