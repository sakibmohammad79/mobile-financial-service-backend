import { AdminModel } from './admin.model';

const createAdminIntoDB = async (payload: any) => {
  const data = await AdminModel.create(payload);
  return data;
};
const getAllAdminFromDB = async () => {
  const data = await AdminModel.find();
  return data;
};
const getAdminByIdfromDB = async (id: string) => {
  const data = await AdminModel.findById(id);
  return data;
};

export const AdminService = {
  createAdminIntoDB,
  getAdminByIdfromDB,
  getAllAdminFromDB,
};
