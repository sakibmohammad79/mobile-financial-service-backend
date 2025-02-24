import { Router } from 'express';
import { TransactionController } from './transition.controller';

const route = Router();

// route.get('/', UserController.getAllUser);
// route.get('/:id', UserController.getUserById);

route.post('/send-money', TransactionController.sendMoney);
route.post('/cash-out', TransactionController.cashOut);

export const TransactionRoutes = route;
