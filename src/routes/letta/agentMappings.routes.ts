import { Router } from 'express';
import * as agentMappingsController from '@/controllers/letta/agentMappings.controller.js';

const router = Router();

router.post('/', agentMappingsController.create);

export default router;
