import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AgentRoutes } from '../modules/agent/agent.routes';
import { AdminRoutes } from '../modules/admin/admin.route';
import { TransactionRoutes } from '../modules/transition/transition.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/agent',
    route: AgentRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/transition',
    route: TransactionRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
