import { Router, Request, Response } from 'express';
import agentRoutes from '@/routes/agent.routes.js';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Letta API Server is running',
    endpoints: {
      createAgent: 'POST /api/agents',
      getAgent: 'GET /api/agents/:agentId',
      chatWithAgent: 'POST /api/agents/:agentId/messages',
      deleteBlock: 'DELETE /api/agents/blocks/:blockId',
    },
  });
});

router.use('/agents', agentRoutes);

export default router;
