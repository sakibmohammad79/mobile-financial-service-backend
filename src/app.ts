import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import router from './app/routes';
const app: Application = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Mobile financial service app is running!');
});

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
