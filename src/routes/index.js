import categoryRoutes from './category.routes.js';
import express from 'express';
import userRoutes from './auth.routes.js';

const router = express.Router();

const rootRoutes = [categoryRoutes, userRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
