import { Router } from 'express';
import { TransactionController } from './transition.controller';

const route = Router();

route.get('/agent/:agentId', TransactionController.getAgentTransactions);
route.get('/user/:userId', TransactionController.getUserTransactions);

route.post('/send-money', TransactionController.sendMoney);
route.post('/cash-out', TransactionController.cashOut);
route.post('/cash-in', TransactionController.cashIn);
route.post('/add-money', TransactionController.addmoney);

export const TransactionRoutes = route;
