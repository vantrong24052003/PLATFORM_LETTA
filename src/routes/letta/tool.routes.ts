import { Router } from 'express';
import * as toolController from '@/controllers/letta/tool.controller.js';

const router = Router();

router.post('/', toolController.createTool);

export default router;
