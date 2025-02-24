import { Router } from 'express';
import { UserController } from './user.controller';

const route = Router();

route.get('/', UserController.getAllUser);
route.get('/:id', UserController.getUserById);

route.post('/create-user', UserController.createUser);

export const UserRoutes = route;
