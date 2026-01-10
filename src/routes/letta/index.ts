import { Router } from 'express';
import agentRoutes from './agent.routes.js';
import toolRoutes from './tool.routes.js';
import blockRoutes from './block.routes.js';

const router = Router();

// Mount các sub-resources trước để tránh clash với dymamic params của agentRoutes
router.use('/agents/tools', toolRoutes);
router.use('/agents/blocks', blockRoutes);
router.use('/agents', agentRoutes);

export default router;
