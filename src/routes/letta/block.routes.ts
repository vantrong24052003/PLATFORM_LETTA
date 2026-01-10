import { Router } from 'express';
import * as agentController from '@/controllers/agent.controller.js';

const router = Router();

router.delete('/:blockId', agentController.deleteBlock);

export default router;
