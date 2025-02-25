import { StatusCodes } from 'http-status-codes';
import { AgentModel } from '../agent/agent.mode';

import ApiError from '../../error/ApiError';
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

export const approveAgentService = async (agentId: string) => {
  const agent = await AgentModel.findById(agentId);
  if (!agent) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Agent not found.');
  }

  agent.isVerified = true;
  const data = await agent.save();

  return data;
};

export const AdminService = {
  createAdminIntoDB,
  getAdminByIdfromDB,
  getAllAdminFromDB,
  approveAgentService,
};
