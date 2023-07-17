import express from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create-order', orderController.create);
router.get('/orders', orderController.getAll);

export default router;
