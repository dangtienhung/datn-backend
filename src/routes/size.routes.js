import express from 'express';
import { SizeController } from '../controllers/size.controller.js';

const sizeRoutes = express.Router();

sizeRoutes.route('/sizes').get(SizeController.getAllSize);
sizeRoutes.route('/size').post(SizeController.createSize);
sizeRoutes
  .route('/size/:id')
  .delete(SizeController.deleteSize)
  .get(SizeController.getSize)
  .put(SizeController.updateSize);

export default sizeRoutes;
