import { categoryController } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.get('/categories', categoryController.getAll);

export default router;
