import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { cashOutService, TransactionService } from './transition.service';

const sendMoney: RequestHandler = catchAsync(async (req, res, next) => {
  const { senderId, receiverPhone, amount } = req.body;
  const result = await TransactionService.sendMoneyIntoDB(
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

  // Call service function
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

export const TransactionController = {
  sendMoney,
  cashOut,
};
