import categoryRoutes from './category.routes.js';
import express from 'express';

const router = express.Router();

const rootRoutes = [categoryRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
