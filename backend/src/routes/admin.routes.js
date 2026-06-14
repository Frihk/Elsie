import { Router } from 'express';
import { getAdminSummary } from '../controllers/admin.controller.js';

const router = Router();

router.get('/summary', getAdminSummary);

export default router;
