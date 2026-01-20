import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from '@/routes/index.js';
import { errorHandler } from '@/middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

// CORS configuration - Allow all origins for embed script
app.use(cors({
  origin: '*', // Allow all origins for widget embedding
  credentials: false,
}));

// Serve static files (embed.js)
app.use('/widget', express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
