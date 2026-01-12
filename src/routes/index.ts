import { Router, Request, Response } from 'express';
import lettaRouter from '@/routes/letta/index.js';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Letta API Server is running',
    endpoints: {
      agents: '/api/letta/agents',
      tools: '/api/letta/tools',
      blocks: '/api/letta/blocks',
    },
  });
});

router.use('/letta', lettaRouter);

export default router;
