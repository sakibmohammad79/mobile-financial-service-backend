import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AgentRoutes } from '../modules/agent/agent.routes';

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
  //   {
  //     path: '/admin',
  //     route: AuthRoutes,
  //   },
  //   {
  //     path: '/auth',
  //     route: PublisherRoutes,
  //   },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
