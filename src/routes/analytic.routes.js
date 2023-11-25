import { analyticController } from '../controllers/index.js';
import express from 'express';

const router = express.Router();

/* order */
router.get('/countOrder', analyticController.countOrder);
router.get('/countOrderWeek', analyticController.countOrderWeek);
/* đếm số order theo sản phẩm */
router.get('/countOrderDayByProduct', analyticController.countOrderDayByProduct);
/* đếm số lượng người dùng */
router.get('/countUser', analyticController.countUser);

router.get('/analytics', analyticController.analytics);

export default router;
