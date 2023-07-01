
import express from 'express';
import { userController } from '../controllers/user.controllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
// get
router.get('/users', authMiddleware,
  // isAdmin,
  userController.getAllUser);
router.get('/users/:id', authMiddleware, userController.getUser);

// update
router.patch('/users/:id', authMiddleware, userController.updateUser)
router.patch("/user/updatePassword", authMiddleware, userController.updatePassword)
// post

// delete
router.delete('/users/:id', authMiddleware,
  //  isAdmin, 
  userController.deleteUser)

export default router;
