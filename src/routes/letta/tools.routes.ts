import { Router } from 'express';
import * as toolsController from '@/controllers/letta/tools.controller.js';

const router = Router();

router.get('/', toolsController.index);
router.post('/', toolsController.create);
router.get('/:id', toolsController.show);
router.put('/:id', toolsController.update);
router.delete('/:id', toolsController.destroy);

export default router;
