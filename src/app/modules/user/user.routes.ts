import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { userValidationSchema } from './user.validation';

const route = Router();

route.get('/', UserController.getAllUser);
route.get('/:id', UserController.getUserById);

route.post(
  '/create-user',
  validateRequest(userValidationSchema),
  UserController.createUser,
);

export const UserRoutes = route;
