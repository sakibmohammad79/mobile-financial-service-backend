import { StatusCodes } from 'http-status-codes';
import RechargeRequestModel, { AgentModel } from '../agent/agent.mode';
import bcryptjs from 'bcryptjs';
import ApiError from '../../error/ApiError';
import { AdminModel } from './admin.model';
import { TransactionModel } from '../transition/transition.model';
import mongoose from 'mongoose';

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

/**
 * Approve a recharge request by admin.
 */
export const approveAgentBalanceRechargeRequest = async (requestId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the recharge request
    const rechargeRequest =
      await RechargeRequestModel.findById(requestId).session(session);
    console.log(rechargeRequest);
    if (!rechargeRequest) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Recharge request not found.');
    }
    if (rechargeRequest.status !== 'pending') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Request is not pending.');
    }

    // Find the agent
    const agent = await AgentModel.findById(rechargeRequest.agentId).session(
      session,
    );
    if (!agent) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Agent not found.');
    }

    // Find the admin
    const admin = await AdminModel.findOne().session(session);
    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Admin account not found.');
    }

    // Check if the admin has enough balance
    if (admin.totalSystemBalance < rechargeRequest.amount) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Insufficient admin balance.',
      );
    }

    // Approve request - Update balances
    agent.balance += rechargeRequest.amount;
    admin.totalSystemBalance -= rechargeRequest.amount;
    rechargeRequest.status = 'approved';

    // Create transaction record
    const transaction = await TransactionModel.create(
      [
        {
          senderId: admin._id,
          senderType: 'admin',
          receiverId: agent._id,
          amount: rechargeRequest.amount,
          type: 'recharge',
          fee: 0,
        },
      ],
      { session },
    );

    // Link transaction to both Admin and Agent
    agent.transactions?.push(transaction[0]._id);
    admin.transactions?.push(transaction[0]._id);

    // Save updates
    await rechargeRequest.save({ session });
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

export const AdminService = {
  createAdminIntoDB,
  getAdminByIdfromDB,
  getAllAdminFromDB,
  approveAgentService,
  approveAgentBalanceRechargeRequest,
};
