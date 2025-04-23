import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import cors from 'cors';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello vampire!');
});

app.use('/api/v1', router);

export default app;
