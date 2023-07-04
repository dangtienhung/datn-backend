import Role from '../models/role.model';

const RoleController = {
  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.find({});
      if (!roles) {
        return res.status(404).json({ message: 'succes', err: 'Not found any roles' });
      }
      return res.status(200).send({ message: 'success', data: roles });
    } catch (error) {
      next(error);
    }
  },
};

export default RoleController;
