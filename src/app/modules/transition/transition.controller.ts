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

const requestBalanceRecharge: RequestHandler = catchAsync(async (req, res) => {
  const { agentId, amount } = req.body;
  const result = await TransactionService.requestBalanceRechargeService(
    agentId,
    amount,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Balance recharge successful!',
    data: result,
  });
});

export const TransactionController = {
  sendMoney,
  cashOut,
  cashIn,
  requestBalanceRecharge,
};
