import { Router } from 'express';
import { AdminController } from './admin.controller';
import { adminValidationSchema } from './admin.validation';
import { validateRequest } from '../../middlewares/validateRequest';

const route = Router();

route.get('/', AdminController.getAllAdmin);
route.get('/:id', AdminController.getAdminById);

route.post(
  '/create-admin',
  validateRequest(adminValidationSchema),
  AdminController.createAdmin,
);

export const AdminRoutes = route;
