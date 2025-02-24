import mongoose from 'mongoose';
import { AgentModel } from './agent.mode';

const createAgentIntoDB = async (payload: any) => {
  payload._id = new mongoose.Types.ObjectId(); // Convert to ObjectId
  const createAgentData = await AgentModel.create(payload);
  return createAgentData;
};
const getAllAgentFromDB = async () => {
  const data = await AgentModel.find();
  return data;
};
const getAgentByIdfromDB = async (id: string) => {
  const data = await AgentModel.findById(id);
  return data;
};

export const AgentServices = {
  createAgentIntoDB,
  getAgentByIdfromDB,
  getAllAgentFromDB,
};
