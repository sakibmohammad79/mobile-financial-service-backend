import mongoose from 'mongoose';
import { AgentModel } from './agent.mode';
import ApiError from '../../error/ApiError';

const createAgentIntoDB = async (payload: any) => {
  const createAgentData = await AgentModel.create(payload);
  return createAgentData;
};

const getAllAgentFromDB = async (phone?: string) => {
  const query: any = { isDeleted: false, isActive: true };

  if (phone) {
    query.mobileNumber = { $regex: phone, $options: 'i' };
  }

  const data = await AgentModel.find(query);
  return data;
};

const getAgentByIdFromDB = async (id: string) => {
  const data = await AgentModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  return data;
};

const updateAgentById = async (id: string, updateData: any) => {
  const agent = await AgentModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  if (!agent) throw new ApiError(404, 'agent not found');
  const updatedAgent = await AgentModel.findByIdAndUpdate(id, updateData, {
    new: true, // Return updated document
    runValidators: true, // Ensure validations
  });
  return updatedAgent;
};

const blockAgentById = async (id: string) => {
  const agent = await AgentModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  if (!agent) throw new ApiError(404, 'agent not found');
  const blockedAgent = await AgentModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  return blockedAgent;
};

const softDeleteAgentById = async (id: string) => {
  const agent = await AgentModel.findOne({
    _id: id,
    isDeleted: false,
    isActive: true,
  });
  if (!agent) throw new ApiError(404, 'agent not found');
  const softDeletedAgent = await AgentModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return softDeletedAgent;
};

export const AgentServices = {
  createAgentIntoDB,
  getAllAgentFromDB,
  getAgentByIdFromDB,
  updateAgentById,
  blockAgentById,
  softDeleteAgentById,
};
