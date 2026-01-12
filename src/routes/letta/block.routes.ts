import { Router } from 'express';
import * as blockController from '@/controllers/letta/block.controller.js';

const router = Router();

router.delete('/:blockId', blockController.deleteBlock);

export default router;
