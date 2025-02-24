import { UserModel } from './user.model';

const createUserIntoDB = async (payload: any) => {
  const createUserData = await UserModel.create(payload);
  return createUserData;
};
const getAllUsersFromDB = async () => {
  const data = await UserModel.find();
  return data;
};
const getUserByIdfromDB = async (id: string) => {
  const data = await UserModel.findById(id);
  return data;
};

export const UserService = {
  getAllUsersFromDB,
  createUserIntoDB,
  getUserByIdfromDB,
};
