import { Router } from 'express';
import { AdminController } from './admin.controller';
import { adminValidationSchema } from './admin.validation';
import { validateRequest } from '../../middlewares/validateRequest';

const route = Router();

route.get('/recharge-request', AdminController.getAllRechareRequest);
route.get('/', AdminController.getAllAdmin);
route.get('/:id', AdminController.getAdminById);

route.post(
  '/create-admin',
  validateRequest(adminValidationSchema),
  AdminController.createAdmin,
);

route.patch('/approve-agent/:agentId', AdminController.approveAgentService);
route.patch(
  '/approve-balance-recharge/:id',
  AdminController.approveBalanceRechargeRequest,
);
route.patch(
  '/reject-balance-recharge/:id',
  AdminController.rejectBalanceRechargeRequest,
);

export const AdminRoutes = route;
