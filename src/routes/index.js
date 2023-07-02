import AuthRouter from './auth.router.js';
import UserRoutes from './user.routers.js';
import categoryRoutes from './category.routes.js';
import express from 'express';
import userRoutes from './auth.routes.js';

const router = express.Router();

// const rootRoutes = [categoryRoutes, userRoutes];
const rootRoutes = [categoryRoutes, UserRoutes, AuthRouter, userRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
