import { Router } from 'express';
import * as agentController from '@/controllers/agent.controller.js';

const router = Router();

router.post('/', agentController.createTool);
router.get('/', agentController.listTools);

export default router;
