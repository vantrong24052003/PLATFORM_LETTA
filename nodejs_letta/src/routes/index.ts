import { Router } from 'express';
import lettaRouter from '@/routes/letta/index.js';

const router: Router = Router();
router.use('/letta', lettaRouter);

export default router;
