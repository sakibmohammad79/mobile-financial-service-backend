import mongoose from 'mongoose';
import { AgentModel } from './agent.mode';
import { TransactionModel } from '../transition/transition.model';
import ApiError from '../../error/ApiError';
import { StatusCodes } from 'http-status-codes';
import { AdminModel } from '../admin/admin.model';

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

export const requestBalanceRechargeService = async (
  agentId: string,
  amount: number,
) => {
  if (amount <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Amount must be greater than 0.',
    );
  }

  const admin = await AdminModel.findOne();
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin account not found.');
  }
  if (admin.totalSystemBalance < amount) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Admin has insufficient balance.',
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find agent
    const agent = await AgentModel.findById(agentId).session(session);
    if (!agent) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Agent not found.');
    }
    if (!agent.isVerified) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Agent is not verified.');
    }

    // Update agent and admin balances
    agent.balance += amount;
    admin.totalSystemBalance -= amount;

    // Create transaction record
    const transaction = await TransactionModel.create(
      [
        {
          senderId: admin._id,
          senderType: 'admin', // Differentiates from user transactions
          receiverId: agent._id,
          amount,
          type: 'recharge',
          fee: 0,
        },
      ],
      { session },
    );

    // Link transaction to both Admin and Agent
    agent.transactions?.push(transaction[0]._id);
    admin.transactions?.push(transaction[0]._id);

    await agent.save({ session });
    await admin.save({ session });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const AgentServices = {
  createAgentIntoDB,
  getAgentByIdfromDB,
  getAllAgentFromDB,
  requestBalanceRechargeService,
};
