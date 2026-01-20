import { Router } from 'express';
import * as knowledgeBasesController from '@/controllers/letta/knowledgeBases.controller.js';

const router = Router();

router.get('/', knowledgeBasesController.index);
router.post('/', knowledgeBasesController.create);
router.get('/:id', knowledgeBasesController.show);
router.put('/:id', knowledgeBasesController.update);
router.delete('/:id', knowledgeBasesController.destroy);

export default router;
