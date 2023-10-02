import { authMiddleware } from '../middlewares/authMiddleware.js';
import express from 'express';
import { userController } from '../controllers/user.controllers.js';

const router = express.Router();
// get
router.get(
  '/users',
  // isAdmin,
  authMiddleware.verifyToken,
  userController.getAllUser
);
router.get(
  '/users/roles/:roleName',
  authMiddleware.verifyTokenAdmin,
  userController.getAllRoleUser
);
router.put('/user/role/:idUser', authMiddleware.verifyTokenAdmin, userController.isActiveUser);
router.get('/users/:id', authMiddleware.verifyToken, userController.getUser);

// update
router.patch('/updateInfor/:id', userController.updateInfor);
router.patch('/users/:id', authMiddleware.verifyToken, userController.updateUser);
router.patch(
  '/user/updatePassword',
  authMiddleware.verifyTokenAdmin,
  userController.updatePassword
);

router.route('/changeRoleUser/:id/:idRole').put(userController.changeRoleUser);
// post
router.route('/logout').post(userController.logOut);
// delete
router.delete(
  '/users/:id',
  // authMiddleware.verifyTokenAdmin,
  //  isAdmin,
  userController.deleteUser
);

/* thêm người dùng */
router.post('/users', userController.createUser);

export default router;
