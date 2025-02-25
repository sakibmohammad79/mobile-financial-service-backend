import { StatusCodes } from 'http-status-codes';
import ApiError from '../../error/ApiError';
import { UserModel } from '../user/user.model';
import { AdminModel } from '../admin/admin.model';
import mongoose from 'mongoose';
import { TransactionModel } from './transition.model';
import { AgentModel } from '../agent/agent.mode';

export const sendMoneyService = async (
  senderId: string,
  receiverPhone: string,
  amount: number,
) => {
  if (amount < 50) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Minimum transaction amount is 50 Taka.',
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await UserModel.findById(senderId).session(session);
    if (!sender) throw new ApiError(StatusCodes.NOT_FOUND, 'Sender not found.');

    const receiver = await UserModel.findOne({
      mobileNumber: receiverPhone,
    }).session(session);
    if (!receiver)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Receiver not found.');

    const fee = amount > 100 ? 5 : 0;
    const totalDeduction = amount + fee;

    if (sender.balance < totalDeduction) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance.');
    }

    sender.balance -= totalDeduction;
    receiver.balance += amount;

    const admin = await AdminModel.findOne().session(session);
    if (!admin)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Admin account not found.');

    admin.totalIncome += fee;
    admin.totalSystemBalance += fee;

    await sender.save({ session });
    await receiver.save({ session });
    await admin.save({ session });

    const transaction = await TransactionModel.create(
      [
        {
          senderId: sender._id,
          receiverId: receiver._id,
          amount,
          type: 'sendmoney',
          senderType: 'user',
          fee,
        },
      ],
      { session },
    );

    await UserModel.findByIdAndUpdate(
      senderId,
      { $push: { transactions: transaction[0]._id } },
      { session },
    );
    await UserModel.findByIdAndUpdate(
      receiver._id,
      { $push: { transactions: transaction[0]._id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const cashOutService = async (
  userId: string,
  agentId: string,
  amount: number,
  pin: string,
) => {
  if (amount < 50)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Minimum cash-out amount is 50 taka.',
    );

  const user = await UserModel.findById(userId);
  if (!user || user.pin !== pin)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid user or PIN.');

  if (user.balance < amount)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance.');

  const agent = await AgentModel.findById(agentId);
  if (!agent || !agent.isVerified)
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid or unverified agent.');

  const agentFee = amount * 0.01;
  const adminFee = amount * 0.005;
  const totalFee = agentFee + adminFee;
  const totalDeducted = amount + totalFee;

  const admin = await AdminModel.findOne();
  if (!admin)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Admin account not found.');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    user.balance -= totalDeducted;
    await user.save({ session });

    agent.balance += amount - agentFee;
    agent.totalIncome += agentFee;
    await agent.save({ session });

    admin.totalSystemBalance += adminFee;
    admin.totalIncome += adminFee;
    await admin.save({ session });

    const transaction = await TransactionModel.create(
      [
        {
          senderId: user._id,
          receiverId: agent._id,
          amount,
          type: 'cashout',
          fee: totalFee,
        },
      ],
      { session },
    );

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { transactions: transaction[0]._id } },
      { session },
    );
    await AgentModel.findByIdAndUpdate(
      agentId,
      { $push: { transactions: transaction[0]._id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const cashInService = async (
  userId: string,
  agentId: string,
  amount: number,
  pin: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await AgentModel.findById(agentId).session(session);
    if (!agent) throw new ApiError(StatusCodes.NOT_FOUND, 'Agent not found.');
    if (!agent.isVerified)
      throw new ApiError(StatusCodes.FORBIDDEN, 'Agent is not verified.');
    if (agent.pin !== pin)
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid PIN.');
    if (agent.balance < amount) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Agent has insufficient balance.',
      );
    }

    const user = await UserModel.findById(userId).session(session);
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.');

    user.balance += amount;
    agent.balance -= amount;

    const admin = await AdminModel.findOne().session(session);
    if (admin) {
      admin.totalSystemBalance += amount;
      await admin.save({ session });
    }

    await user.save({ session });
    await agent.save({ session });

    const transaction = await TransactionModel.create(
      [
        {
          senderId: agent._id,
          receiverId: user._id,
          amount,
          type: 'cashin',
          fee: 0,
        },
      ],
      { session },
    );

    agent?.transactions?.push(transaction[0]._id);
    user?.transactions?.push(transaction[0]._id);
    await agent.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

export const TransactionService = {
  sendMoneyService,
  cashOutService,
  cashInService,
  requestBalanceRechargeService,
};
