import { categoryController } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

router.get('/categories', categoryController.getAll);
router.get('/category/:id', categoryController.getOne);
router.post('/category', categoryController.create);
router.delete('/category/:id', categoryController.fakeDelete);
router.put('/category/:id', categoryController.update);

export default router;
