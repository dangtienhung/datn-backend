import express from 'express';
import RoleController from '../controllers/role.controller.js';

const RoleRoutes = express.Router();

RoleRoutes.route('/roles').get(RoleController.getAllRoles);
RoleRoutes.route('/role').post(RoleController.createRole);
RoleRoutes.route('/role/:id')
  .get(RoleController.getRole)
  .put(RoleController.updateRole)
  .delete(RoleController.deleteRole);
RoleRoutes.route('/changeStatusRole/:id').put(RoleController.changeStatusRole);

export default RoleRoutes;
