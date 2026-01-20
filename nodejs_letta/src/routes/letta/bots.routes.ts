import { Router } from 'express';
import * as botsController from '@/controllers/letta/bots.controller.js';

const router = Router();

router.get('/', botsController.index);
router.post('/', botsController.create);
router.get('/:id', botsController.show);
router.put('/:id', botsController.update);
router.delete('/:id', botsController.destroy);

export default router;
