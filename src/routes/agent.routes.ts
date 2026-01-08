import { Router } from 'express';
import * as agentController from '@/controllers/agent.controller.js';

const router = Router();

router.post('/', agentController.createAgent);
router.get('/:agentId', agentController.getAgent);
router.post('/:agentId/messages', agentController.chatWithAgent);
router.delete('/blocks/:blockId', agentController.deleteBlock);
export default router;
