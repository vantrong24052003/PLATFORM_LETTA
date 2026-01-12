import { Router } from 'express';
import * as messagesController from '@/controllers/letta/messages.controller.js';

const router = Router();

router.get('/', messagesController.index);
router.post('/', messagesController.create);
router.get('/:id', messagesController.show);
router.put('/:id', messagesController.update);
router.delete('/:id', messagesController.destroy);

export default router;
