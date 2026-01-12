import { Router } from 'express';
import agentRoutes from './agent.routes.js';
import toolRoutes from './tool.routes.js';
import blockRoutes from './block.routes.js';

const router = Router();

router.use('/tools', toolRoutes);
router.use('/blocks', blockRoutes);
router.use('/agents', agentRoutes);

export default router;
