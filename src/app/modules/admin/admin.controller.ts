import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AdminService } from './admin.service';

const createAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body.admin;
  const result = await AdminService.createAdminIntoDB(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

const getAllAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AdminService.getAllAdminFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Admin fetched successfully!',
    data: result,
  });
});

const getAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getAdminByIdfromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Single Admin fetched successfully!',
    data: result,
  });
});
const approveAgentService: RequestHandler = catchAsync(async (req, res) => {
  const { agentId } = req.params;
  const result = await AdminService.approveAgentService(agentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Agent approved successfully!',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  getAllAdmin,
  getAdminById,
  approveAgentService,
};
