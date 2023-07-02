import categoryRoutes from './category.routes.js';
import express from 'express';
import sizeRoutes from './size.routes.js';
import toppingRoutes from './topping.routes.js';
import productRoutes from './product.routes.js';

const router = express.Router();

const rootRoutes = [categoryRoutes, sizeRoutes, toppingRoutes, productRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
