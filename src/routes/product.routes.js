import express from 'express';
import { ProductController } from '../controllers/product.controller.js';
const productRoutes = express.Router();
productRoutes.route('/products').get(ProductController.getAllProducts);
productRoutes.route('/product').post(ProductController.createProduct);
productRoutes
  .route('/product/:id')
  .get(ProductController.getProduct)
  .delete(ProductController.deleteRealProduct)
  .put(ProductController.updateProduct);
productRoutes.route('/deleteFakeProduct/:id').put(ProductController.deleteFakeProduct);
productRoutes.route('/restoreProduct/:id').put(ProductController.restoreProduct);
export default productRoutes;
