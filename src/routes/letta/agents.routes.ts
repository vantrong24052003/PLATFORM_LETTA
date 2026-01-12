import { Router } from 'express';
import * as agentsController from '@/controllers/letta/agents.controller.js';

const router = Router();

router.get('/', agentsController.index);
router.post('/', agentsController.create);
router.get('/:id', agentsController.show);
router.put('/:id', agentsController.update);
router.delete('/:id', agentsController.destroy);

export default router;
