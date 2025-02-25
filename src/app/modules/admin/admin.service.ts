import { StatusCodes } from 'http-status-codes';
import { AgentModel } from '../agent/agent.mode';
import bcryptjs from 'bcryptjs';
import ApiError from '../../error/ApiError';
import { AdminModel } from './admin.model';

const createAdminIntoDB = async (payload: any) => {
  // Check if PIN is exactly 5 digits before hashing
  if (!/^\d{5}$/.test(payload.pin)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'PIN must be exactly 5 digits');
  }
  // Hash the PIN before saving
  const saltRounds = 10;
  const hashedPin = await bcryptjs.hash(payload.pin, saltRounds);
  // Replace plain PIN with hashed PIN
  payload.pin = hashedPin;
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

const approveAgentService = async (agentId: string) => {
  const agent = await AgentModel.findById(agentId);
  if (!agent) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Agent not found.');
  }

  // Approve agent
  agent.isVerified = true;

  // Add 1000 to agent's balance
  agent.balance = (agent.balance || 0) + 100000;

  const data = await agent.save();

  return data;
};

export const AdminService = {
  createAdminIntoDB,
  getAdminByIdfromDB,
  getAllAdminFromDB,
  approveAgentService,
};
