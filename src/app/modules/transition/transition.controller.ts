import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from './transition.service';

const sendMoney: RequestHandler = catchAsync(async (req, res, next) => {
  const { senderId, receiverPhone, amount } = req.body;
  const result = await TransactionService.sendMoneyService(
    senderId,
    receiverPhone,
    amount,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Send money successfully!',
    data: result,
  });
});
const cashOut: RequestHandler = catchAsync(async (req, res, next) => {
  const { userId, agentId, amount, pin } = req.body;
  const result = await TransactionService.cashOutService(
    userId,
    agentId,
    amount,
    pin,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cash out money successfully!',
    data: result,
  });
});
const cashIn: RequestHandler = catchAsync(async (req, res, next) => {
  const { userId, agentId, amount, pin } = req.body;
  const result = await TransactionService.cashInService(
    userId,
    agentId,
    amount,
    pin,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cash In money successfully!',
    data: result,
  });
});
const addmoney: RequestHandler = catchAsync(async (req, res, next) => {
  const { adminId, agentId, amount } = req.body;
  const result = await TransactionService.addMoneyToAgentService(
    adminId,
    agentId,
    amount,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Add money successfully!',
    data: result,
  });
});

const getUserTransactions: RequestHandler = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await TransactionService.getUserTransactionsService(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All user transactions fetched successfully!',
    data: result,
  });
});
const getAgentTransactions: RequestHandler = catchAsync(async (req, res) => {
  const { agentId } = req.params;
  const result = await TransactionService.getAgentTransactionsService(agentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All agent transactions fetched successfully!',
    data: result,
  });
});
const getAllTransaction: RequestHandler = catchAsync(async (req, res) => {

  const result = await TransactionService.getAllTransactionFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All transactions fetched successfully!',
    data: result,
  });
});

export const TransactionController = {
  sendMoney,
  cashOut,
  cashIn,
  getUserTransactions,
  getAgentTransactions,
  addmoney,
  getAllTransaction
};
