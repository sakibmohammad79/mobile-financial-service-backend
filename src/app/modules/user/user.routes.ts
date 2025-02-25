import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { userValidationSchema } from './user.validation';

const route = Router();

route.get('/', UserController.getAllUser);
route.get('/:id', UserController.getUserById);
route.delete('/soft-delete/:id', UserController.useSoftDelete);
route.patch('/update/:id', UserController.updateUser);
route.patch('/blocked/:id', UserController.userBlocked);
route.post(
  '/create-user',
  validateRequest(userValidationSchema),
  UserController.createUser,
);

export const UserRoutes = route;
