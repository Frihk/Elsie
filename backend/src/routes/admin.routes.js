import { Router } from 'express';
import {
	getAdminSummary,
	getContent,
	updateContent,
} from '../controllers/admin.controller.js';

const router = Router();

router.get('/summary', getAdminSummary);
router.get('/content', getContent);
router.put('/content', updateContent);

export default router;
