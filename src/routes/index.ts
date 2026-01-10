import { Router, Request, Response } from 'express';
import lettaRouter from '@/routes/letta/index.js';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Letta API Server is running',
    endpoints: {
      agents: '/api/letta/agents',
      agentTools: '/api/letta/agents/tools',
      agentBlocks: '/api/letta/agents/blocks',
    },
  });
});

router.use('/letta', lettaRouter);

export default router;
