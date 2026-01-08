import express, { Express } from 'express';
import routes from '@/routes/index.js';
import { errorHandler } from '@/middlewares/error.middleware.js';

const app: Express = express();

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
