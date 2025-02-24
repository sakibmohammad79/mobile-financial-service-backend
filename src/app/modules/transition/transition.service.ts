import { StatusCodes } from 'http-status-codes';
import ApiError from '../../error/ApiError';
import { UserModel } from '../user/user.model';
import { AdminModel } from '../admin/admin.model';
import { TransactionModel } from './transition.model';
import { AgentModel } from '../agent/agent.mode';
import mongoose from 'mongoose';

export const sendMoneyIntoDB = async (
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
    // Find Sender
    const sender = await UserModel.findById(senderId).session(session);
    if (!sender) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Sender not found.');
    }

    // Find Receiver
    const receiver = await UserModel.findOne({
      mobileNumber: receiverPhone,
    }).session(session);
    if (!receiver) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Receiver not found.');
    }

    // Calculate Fees
    const fee = amount > 100 ? 5 : 0;
    const totalDeduction = amount + fee;

    // Check Sender Balance
    if (sender.balance < totalDeduction) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance.');
    }

    // Deduct from Sender & Add to Receiver
    sender.balance -= totalDeduction;
    receiver.balance += amount;

    // Add Fee to Admin Account
    const admin = await AdminModel.findOne().session(session);
    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Admin account not found.');
    }

    admin.totalIncome += fee;
    admin.totalSystemBalance += fee;

    // Save Updates
    await sender.save({ session });
    await receiver.save({ session });
    await admin.save({ session });

    // Create Transaction Record
    const transaction = await TransactionModel.create(
      [
        {
          senderId: sender._id,
          receiverId: receiver._id,
          amount,
          type: 'sendmoney',
          fee,
        },
      ],
      { session },
    );

    // Add transaction to sender & receiver history
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

    return {
      success: true,
      message: 'Transaction successful!',
      data: transaction[0],
    };
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
  // Validate amount
  if (amount < 50) {
    throw new Error('Minimum cash-out amount is 50 taka.');
  }

  // Validate user
  const user = await UserModel.findById(userId);
  if (!user || user.pin !== pin) {
    throw new Error('Invalid user or PIN.');
  }
  if (user.balance < amount) {
    throw new Error('Insufficient balance.');
  }

  // Validate agent
  const agent = await AgentModel.findById(agentId);
  if (!agent || !agent.isVerified) {
    throw new Error('Invalid or unverified agent.');
  }

  // Calculate fees
  const agentFee = amount * 0.01; // 1% for agent
  const adminFee = amount * 0.005; // 0.5% for admin
  const totalFee = agentFee + adminFee;
  const totalDeducted = amount + totalFee; // User pays the amount + fees

  // Validate admin
  const admin = await AdminModel.findOne();
  if (!admin) {
    throw new Error('Admin account not found.');
  }

  // Start Mongoose transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update user balance
    user.balance -= totalDeducted;
    await user.save({ session });

    // Update agent balance & income
    agent.balance += amount - agentFee; // Agent gets amount minus their 1% fee
    agent.totalIncome += agentFee;
    await agent.save({ session });

    // Update admin balance & income
    admin.totalSystemBalance += adminFee;
    admin.totalIncome += adminFee;
    await admin.save({ session });

    // Create transaction record
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

    // Push transaction to user and agent
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

    // Commit transaction
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
  sendMoneyIntoDB,
  cashOutService,
};
