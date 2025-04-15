import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AgentController } from './agent.controller';
import { agentValidationSchema } from './agent.validation';

const route = Router();

route.get('/', AgentController.getAllAgent);
route.get('/:id', AgentController.getAgentById);

route.post(
  '/create-agent',
  validateRequest(agentValidationSchema),
  AgentController.createAgent,
);

route.patch('/update/:id', AgentController.updateAgentById);
route.patch('/blocked/:id', AgentController.blockAgentById);
route.patch('/unblocked/:id', AgentController.unblockAgentById);
route.delete('/soft-delete/:id', AgentController.softDeleteAgentById);
route.post('/balance-recharge', AgentController.requestBalanceRecharge);

export const AgentRoutes = route;
