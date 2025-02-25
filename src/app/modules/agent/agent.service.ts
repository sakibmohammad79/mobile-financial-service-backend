import mongoose from 'mongoose';
import { AgentModel } from './agent.mode';

const createAgentIntoDB = async (payload: any) => {
  payload._id = new mongoose.Types.ObjectId(); // Convert to ObjectId
  const createAgentData = await AgentModel.create(payload);
  return createAgentData;
};

const getAllAgentFromDB = async () => {
  const data = await AgentModel.find({ isDeleted: false }); // Exclude soft-deleted agents
  return data;
};

const getAgentByIdFromDB = async (id: string) => {
  const data = await AgentModel.findOne({ _id: id, isDeleted: false }); // Exclude soft-deleted agent
  return data;
};

const updateAgentById = async (id: string, updateData: any) => {
  const updatedAgent = await AgentModel.findByIdAndUpdate(id, updateData, {
    new: true, // Return updated document
    runValidators: true, // Ensure validations
  });
  return updatedAgent;
};

const blockAgentById = async (id: string) => {
  const blockedAgent = await AgentModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  return blockedAgent;
};

const softDeleteAgentById = async (id: string) => {
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
