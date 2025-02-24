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

export const AgentRoutes = route;
