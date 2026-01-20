import { Router } from 'express';
import botsRoutes from './bots.routes.js';
import agentMappingsRoutes from './agentMappings.routes.js';
import agentsRoutes from './agents.routes.js';
import knowledgeBasesRoutes from './knowledgeBases.routes.js';
import toolsRoutes from './tools.routes.js';
import messagesRoutes from './messages.routes.js';

const router = Router();

router.use('/bots', botsRoutes);
router.use('/agent-mappings', agentMappingsRoutes);
router.use('/agents', agentsRoutes);
router.use('/knowledge-bases', knowledgeBasesRoutes);
router.use('/tools', toolsRoutes);
router.use('/messages', messagesRoutes);

export default router;
