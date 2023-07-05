import express from 'express';
import { userController } from '../controllers/user.controllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
// get
router.get(
  '/users',
  // isAdmin,
  authMiddleware.verifyTokenAdmin,
  userController.getAllUser
);
router.get('/users/:id', authMiddleware.verifyTokenAdmin, userController.getUser);

// update
router.patch('/users/:id', authMiddleware.verifyTokenAdmin, userController.updateUser);
router.patch(
  '/user/updatePassword',
  authMiddleware.verifyTokenAdmin,
  userController.updatePassword
);

router.route('/changeRoleUser/:id/:idRole').put(userController.changeRoleUser);
// post

// delete
router.delete(
  '/users/:id',
  authMiddleware.verifyTokenAdmin,
  //  isAdmin,
  userController.deleteUser
);

export default router;
