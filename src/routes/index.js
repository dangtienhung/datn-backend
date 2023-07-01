import categoryRoutes from './category.routes.js';
import UserRoutes from './user.routers.js';
import AuthRouter from './auth.router.js';
import express from 'express';

const router = express.Router();

const rootRoutes = [categoryRoutes, UserRoutes, AuthRouter];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
