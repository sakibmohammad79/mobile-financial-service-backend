import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AgentServices } from './agent.service';

const createAgent: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body.agent;
  const result = await AgentServices.createAgentIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Agent created successfully!',
    data: result,
  });
});

const getAllAgent: RequestHandler = catchAsync(async (req, res) => {
  const { phone } = req.query;
  const result = await AgentServices.getAllAgentFromDB(phone as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All agents fetched successfully!',
    data: result,
  });
});

const getAgentById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.getAgentByIdFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Agent fetched successfully!',
    data: result,
  });
});

const updateAgentById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await AgentServices.updateAgentById(id, updateData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Agent updated successfully!',
    data: result,
  });
});

const blockAgentById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.blockAgentById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Agent blocked successfully!',
    data: result,
  });
});

const softDeleteAgentById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AgentServices.softDeleteAgentById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Agent deleted successfully!',
    data: result,
  });
});

export const AgentController = {
  createAgent,
  getAllAgent,
  getAgentById,
  updateAgentById,
  blockAgentById,
  softDeleteAgentById,
};
