import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AgentServices } from './agent.service';

const createAgent: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body.agent;
  console.log(payload);
  const result = await AgentServices.createAgentIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Agent created successfully!',
    data: result,
  });
});

const getAllAgent: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AgentServices.getAllAgentFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All agent fetched successfully!',
    data: result,
  });
});

const getAgentById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.getAgentByIdfromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Single agent fetched successfully!',
    data: result,
  });
});

export const AgentController = {
  createAgent,
  getAllAgent,
  getAgentById,
};
