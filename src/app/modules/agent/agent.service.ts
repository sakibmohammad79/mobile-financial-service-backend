import mongoose from 'mongoose';
import RechargeRequestModel, { AgentModel } from './agent.mode';
import ApiError from '../../error/ApiError';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

const createAgentIntoDB = async (payload: any) => {
  // Check if PIN is exactly 5 digits before hashing
  if (!/^\d{5}$/.test(payload.pin)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'PIN must be exactly 5 digits');
  }
  // Hash the PIN before saving
  const saltRounds = 10;
  const hashedPin = await bcryptjs.hash(payload.pin, saltRounds);

  // Replace plain PIN with hashed PIN
  payload.pin = hashedPin;
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

/**
 * Create a recharge request by an agent.
 */
export const createBalanceRechargeRequest = async (
  agentId: string,
  amount: number,
) => {
  if (amount <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Amount must be greater than 0.',
    );
  }

  // Check if agent exists and is active
  const agent = await AgentModel.findById(agentId);
  if (!agent) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Agent not found.');
  }
  if (!agent.isVerified || !agent.isActive || agent.isDeleted) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Agent is not verified, inactive, or deleted.',
    );
  }

  // Create a recharge request (pending approval)
  const rechargeRequest = await RechargeRequestModel.create({
    agentId,
    amount,
    status: 'pending', // Status: pending | approved | rejected
  });

  return rechargeRequest;
};

export const AgentServices = {
  createAgentIntoDB,
  getAllAgentFromDB,
  getAgentByIdFromDB,
  updateAgentById,
  blockAgentById,
  softDeleteAgentById,
  createBalanceRechargeRequest,
};
