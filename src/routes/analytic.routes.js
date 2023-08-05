import { analyticController } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.get('/countVoucher', analyticController.countVoucher);

export default router;
