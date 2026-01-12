import { Router } from 'express';
import * as agentMappingsController from '@/controllers/letta/agentMappings.controller.js';

const router = Router();

router.get('/', agentMappingsController.index);
router.post('/', agentMappingsController.create);
router.get('/:id', agentMappingsController.show);
router.put('/:id', agentMappingsController.update);
router.delete('/:id', agentMappingsController.destroy);

export default router;
