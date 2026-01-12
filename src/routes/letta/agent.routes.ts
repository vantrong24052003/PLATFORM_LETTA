import { Router } from 'express';
import * as agentController from '@/controllers/letta/agent.controller.js';

const router = Router();

router.post('/', agentController.createAgent);
router.get('/:agentId', agentController.getAgent);
router.post('/:agentId/messages', agentController.chatWithAgent);

export default router;
