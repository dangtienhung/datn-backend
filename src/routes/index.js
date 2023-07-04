import AuthRouter from './auth.router.js';
import UserRoutes from './user.routers.js';
import categoryRoutes from './category.routes.js';
import express from 'express';
import sizeRoutes from './size.routes.js';
import toppingRoutes from './topping.routes.js';
import productRoutes from './product.routes.js';
import userRoutes from './auth.routes.js';
import uploadRouter from './uploadfiles.routes.js';

const router = express.Router();

const rootRoutes = [
  categoryRoutes,
  UserRoutes,
  AuthRouter,
  userRoutes,
  sizeRoutes,
  toppingRoutes,
  productRoutes,
  uploadRouter,
];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
