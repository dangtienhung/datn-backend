import { categoryController } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.get('/categories', categoryController.getAll);
router.get('/category/:id', categoryController.getOne);
router.post('/category', categoryController.create);

export default router;
