import { Router } from 'express';
import * as agentController from '@/controllers/agent.controller.js';

const router = Router();

router.post('/', agentController.createAgent);
router.get('/', agentController.listAgents);
router.get('/:agentId', agentController.getAgent);
router.post('/:agentId/messages', agentController.chatWithAgent);
router.get('/:agentId/messages', agentController.listMessages);

export default router;
